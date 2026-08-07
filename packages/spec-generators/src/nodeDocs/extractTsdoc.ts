/**
 * TypeDoc-driven extraction of the `## Functions` blocks and utility pages the node docs inject.
 *
 * TypeDoc runs in-process (no CLI subprocess) with `typedoc-plugin-markdown`, and each rendered page is
 * captured as a string via `MarkdownPageEvent.END`. Two options make that output a drop-in for the docs
 * contract, so the markdown is used verbatim - no heading demotion, no section stripping, no regex:
 * - `outputFileStrategy: 'modules'` emits one page per source module rather than one per exported member.
 * - `hidePageTitle: true` drops TypeDoc's own H1, so each page begins directly at `## Functions`.
 */

import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Path } from '@codama/fragments';
import { Application, Converter, TSConfigReader, type TypeDocOptions } from 'typedoc';
import { MarkdownPageEvent, type PluginOptions } from 'typedoc-plugin-markdown';
import { isJSDocSignature, type TypeNode } from 'typescript';

import { BLOCK_SEPARATOR } from './constants';

/** Output directory (under the docs root) for the standalone utility pages. */
const UTILITIES_DIR = 'utilities';

/** Standalone utility pages emitted under `utilities/`, keyed by page id. */
export type UtilityId = 'NestedTypeNode' | 'Node' | 'Shared';

/** H1 title (and root-index link label) for each utility page. TypeDoc emits no page title of its own. */
const UTILITY_TITLES: Record<UtilityId, string> = {
    NestedTypeNode: 'Nested type node helpers',
    Node: 'Node type guards',
    Shared: 'Shared utilities',
};

/**
 * Route a source module's helpers into a
 * - node kind's `## Functions`
 * - or a standalone utility page.
 */
export type Target =
    | { readonly kind: string; readonly type: 'kind' }
    | { readonly type: 'utility'; readonly utility: UtilityId };

/** One rendered standalone page: its extension-less path segments, title, and body. */
export interface UtilityPage {
    readonly content: string;
    readonly pathSegments: readonly Path[];
    readonly title: string;
}

export interface ExtractedDocs {
    /** `## Functions` markdown block keyed by node kind. */
    readonly functions: Record<string, string>;
    /** Standalone utility pages (Shared utils, Node guards, NestedTypeNode helpers). */
    readonly utilityPages: readonly UtilityPage[];
}

/**
 * Source modules (relative to `packages/nodes/src`) whose exported helpers we document, each paired with its
 * routing target. A `kind` target injects the helpers into that node's page; a `utility` target collects them
 * onto the matching standalone `utilities/` page.
 */
export const ENTRY_MODULES = [
    { file: 'ConstantPdaSeedNode.ts', target: { kind: 'constantPdaSeedNode', type: 'kind' } },
    { file: 'ConstantValueNode.ts', target: { kind: 'constantValueNode', type: 'kind' } },
    { file: 'EnumTypeNode.ts', target: { kind: 'enumTypeNode', type: 'kind' } },
    { file: 'InstructionArgumentNode.ts', target: { kind: 'instructionArgumentNode', type: 'kind' } },
    { file: 'InstructionNode.ts', target: { kind: 'instructionNode', type: 'kind' } },
    { file: 'NumberTypeNode.ts', target: { kind: 'numberTypeNode', type: 'kind' } },
    { file: 'ProgramNode.ts', target: { kind: 'programNode', type: 'kind' } },
    { file: 'NestedTypeNode.ts', target: { type: 'utility', utility: 'NestedTypeNode' } },
    { file: 'Node.ts', target: { type: 'utility', utility: 'Node' } },
    // The barrel, not the two leaf modules it re-exports: one entry point means one TypeDoc page, so the
    // Shared helpers land under a single set of group headings instead of one per source file.
    { file: 'shared/index.ts', target: { type: 'utility', utility: 'Shared' } },
] as const satisfies readonly { file: string; target: Target }[];

/**
 * TypeDoc names each page after its entry point relative to the common source root, so `src/ProgramNode.ts`
 * renders to `ProgramNode.md`. A barrel collapses to its directory: `src/shared/index.ts` becomes `shared.md`.
 * Normalising both sides the same way makes the extension-less page URL the join key back to `ENTRY_MODULES`.
 */
const pageKey = (path: string): string => path.replace(/\.(ts|md)$/, '').replace(/\/index$/, '');

const TARGET_BY_PAGE = new Map(ENTRY_MODULES.map(m => [pageKey(m.file), m.target]));

export async function extractTsdocDocs(): Promise<ExtractedDocs> {
    const nodesRoot = join(findRepoRoot(), 'packages', 'nodes');
    // TypeDoc only fires page events while rendering, so it needs somewhere to write. We read the pages out of
    // memory and drop the directory; nothing downstream reads it.
    const outputDir = mkdtempSync(join(tmpdir(), 'codama-typedoc-'));

    // The `hide*` and `outputFileStrategy` keys are declared by typedoc-plugin-markdown, which does not augment
    // TypeDoc's own option type, so the literal is typed as the intersection and widened at the call site.
    const options: Partial<TypeDocOptions> & PluginOptions = {
        disableSources: true,
        entryPoints: ENTRY_MODULES.map(m => join(nodesRoot, 'src', m.file)),
        hideBreadcrumbs: true,
        hidePageHeader: true,
        hidePageTitle: true,
        logLevel: 'Warn',
        out: outputDir,
        outputFileStrategy: 'modules',
        plugin: ['typedoc-plugin-markdown'],
        readme: 'none',
        tsconfig: join(nodesRoot, 'tsconfig.json'),
    };

    try {
        const app = await Application.bootstrapWithPlugins(options as Partial<TypeDocOptions>, [new TSConfigReader()]);
        useAuthoredTypeAnnotations(app);

        const pages = new Map<string, string>();
        app.renderer.on(MarkdownPageEvent.END, page => {
            if (page.contents) pages.set(page.url, page.contents);
        });

        const project = await app.convert();
        if (!project) throw new Error('TypeDoc failed to convert the nodes helper sources.');
        await app.generateOutputs(project);

        return buildDocs(pages);
    } finally {
        rmSync(outputDir, { force: true, recursive: true });
    }
}

/**
 * Render signatures from the type annotation the author wrote rather than the type the checker resolves.
 *
 * TypeDoc already does this for a bare annotation, but only at the top level: its array and union converters
 * recurse without the source node, so a nested reference falls back to the resolved type and every defaulted
 * type argument is printed. On Codama's node types that turns `: ProgramNode[]` into thousands of characters.
 * Re-converting from the declaration's own AST node routes through the node-based converters all the way down.
 *
 * Covers the return type, the parameter types, and the type-parameter constraints - the last matters because
 * `TKind extends NodeKind` otherwise prints as all ninety-odd node-kind string literals.
 *
 * Anything without an annotation (an inferred return, say) keeps TypeDoc's default behaviour.
 */
function useAuthoredTypeAnnotations(app: Application): void {
    app.converter.on(Converter.EVENT_CREATE_SIGNATURE, (context, reflection, declaration) => {
        if (!declaration || isJSDocSignature(declaration)) return;
        const convert = (node: TypeNode) => context.converter.convertType(context, node);

        if (declaration.type) reflection.type = convert(declaration.type);

        // Matched by position: TypeDoc builds parameter reflections in declaration order, and unlike matching
        // on the name this also covers destructured parameters, which have no identifier to compare against.
        (reflection.parameters ?? []).forEach((parameter, index) => {
            const declared = declaration.parameters?.[index];
            if (declared?.type) parameter.type = convert(declared.type);
        });

        for (const typeParameter of reflection.typeParameters ?? []) {
            const declared = declaration.typeParameters?.find(p => p.name.text === typeParameter.name);
            if (declared?.constraint) typeParameter.type = convert(declared.constraint);
        }
    });
}

/** Route each rendered page to a node kind's `## Functions` block or onto a standalone utility page. */
function buildDocs(pages: ReadonlyMap<string, string>): ExtractedDocs {
    const functions: Record<string, string> = {};
    const utilityMap = new Map<UtilityId, string>();

    const matched = new Set<string>();
    for (const [url, contents] of pages) {
        const key = pageKey(url);
        const target = TARGET_BY_PAGE.get(key);
        // TypeDoc also emits a project-level README that has no entry-point counterpart.
        if (!target) continue;
        matched.add(key);
        switch (target.type) {
            case 'kind':
                functions[target.kind] = contents.trim();
                break;
            case 'utility':
                utilityMap.set(target.utility, contents.trim());
                break;
            default:
                throw new Error(`Unexpected target type ${JSON.stringify(target)} for page ${url}.`);
        }
    }

    // A page URL that stops matching its entry module would otherwise drop that module's helpers silently.
    const unmatched = [...TARGET_BY_PAGE.keys()].filter(key => !matched.has(key));
    if (unmatched.length > 0) {
        throw new Error(
            `TypeDoc emitted no page for entry module(s) ${JSON.stringify(unmatched)}. ` +
                `Pages seen: ${JSON.stringify([...pages.keys()])}.`,
        );
    }

    // TypeDoc emits no page title, so each utility page gets its H1 here.
    const utilityPages: UtilityPage[] = [...utilityMap.entries()]
        .map(([utility, body]) => ({
            content: `# ${UTILITY_TITLES[utility]}${BLOCK_SEPARATOR}${body}`,
            pathSegments: [UTILITIES_DIR, utility],
            title: UTILITY_TITLES[utility],
        }))
        .sort((a, b) => a.pathSegments.join('/').localeCompare(b.pathSegments.join('/')));

    return { functions, utilityPages };
}

/** Walk up from this module until the workspace root (the directory holding `pnpm-workspace.yaml`). */
function findRepoRoot(): string {
    let dir = dirname(fileURLToPath(import.meta.url));
    while (dir !== dirname(dir)) {
        if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return dir;
        dir = dirname(dir);
    }
    throw new Error('Unable to locate the workspace root (no pnpm-workspace.yaml found).');
}
