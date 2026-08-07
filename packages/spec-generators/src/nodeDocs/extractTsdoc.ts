/**
 * ts-morph docs extraction. Instead of shelling out to a doc generator and stripping its markdown, this:
 * - reads the helper source directly.
 * - renders each exported function / type alias to the `### name()` block shape.
 * - inlines the routing config and page assembly so the whole flow lives in one file.
 */

import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Path } from '@codama/fragments';
import { type FunctionDeclaration, type JSDoc, Project, type TypeAliasDeclaration } from 'ts-morph';

import { BLOCK_SEPARATOR } from './constants';

/** Output directory (under the docs root) for the standalone utility pages. */
const UTILITIES_DIR = 'utilities';

/** Standalone utility pages emitted under `utilities/`, keyed by page id. */
type UtilityId = 'NestedTypeNode' | 'Node' | 'Shared';

/** H1 title (and root-index link label) for each utility page - one entry per page. */
const UTILITY_TITLES: Record<UtilityId, string> = {
    NestedTypeNode: 'Nested type node helpers',
    Node: 'Node type guards',
    Shared: 'Shared utilities',
};

/**
 * Route a source module's helpers into a
 * - node kind's `## Functions`
 * - or a standalone utility page.
 * */
type Target =
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
 * One rendered helper block bound to the page it belongs to. Many of these are produced (one per exported
 * function / type alias) and those sharing a `target` are later merged onto the same page by `buildDocs`.
 * - `markdown` is the rendered `### name()` block (heading, signature, description, example).
 * - `name` is the export name, used only to sort blocks alphabetically within a page.
 * - `target` routes the block: `{ kind }` into a node page's `## Functions`, `{ utility }` onto a utility page.
 *
 * @example
 * { name: 'isDecimal', target: { kind: 'numberTypeNode', type: 'kind' }, markdown: '### isDecimal()\n\n> ...' }
 */
interface CodeBlockSection {
    readonly markdown: string;
    readonly name: string;
    readonly target: Target;
}

/**
 * Source modules (relative to `packages/nodes/src`) whose exported helpers we document.
 * Each paired with its routing target:
 * - A `kind` target injects the helpers into that node's page.
 * - A `utility` target collects them into the standalone `utilities/` page.
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
    { file: 'shared/docs.ts', target: { type: 'utility', utility: 'Shared' } },
    { file: 'shared/stringCases.ts', target: { type: 'utility', utility: 'Shared' } },
] as const satisfies readonly { file: string; target: Target }[];

export function extractTsdocDocs(): ExtractedDocs {
    const repoRoot = findRepoRoot();
    const nodesRoot = join(repoRoot, 'packages', 'nodes');
    const project = new Project({
        skipAddingFilesFromTsConfig: true,
        tsConfigFilePath: join(nodesRoot, 'tsconfig.json'),
    });

    const sections = collectCodeBlockSections(project, nodesRoot);
    return buildDocs(sections);
}

/**
 * Render every exported helper across the entry modules into a flat list of blocks, sorted by name.
 * We intentionally scan only functions and type aliases: it is the full surface these helper files export.
 */
function collectCodeBlockSections(project: Project, nodesRoot: string): CodeBlockSection[] {
    const sections: CodeBlockSection[] = [];
    for (const { file, target } of ENTRY_MODULES) {
        const sourceFile = project.addSourceFileAtPath(join(nodesRoot, 'src', file));
        // Functions:
        for (const fn of sourceFile.getFunctions()) {
            const name = fn.getName();
            if (fn.isExported() && name) sections.push({ markdown: renderFunction(name, fn), name, target });
        }
        // Type aliases:
        // TODO: `getFunctions()` misses arrow-function helpers (`export const foo = () => {}`). None exist yet;
        // if one is added, also scan exported variable declarations with a function initializer.
        for (const alias of sourceFile.getTypeAliases()) {
            if (alias.isExported()) sections.push({ markdown: renderTypeAlias(alias), name: alias.getName(), target });
        }
    }
    return sections.sort((a, b) => a.name.localeCompare(b.name));
}

/** Group rendered sections into per-kind `## Functions` blocks and standalone utility pages. */
function buildDocs(sections: CodeBlockSection[]): ExtractedDocs {
    const functions: Record<string, string> = {};
    const utilityMap = new Map<UtilityId, string[]>();

    for (const { markdown, target } of sections) {
        if (target.type === 'kind') {
            functions[target.kind] = functions[target.kind]
                ? `${functions[target.kind]}${BLOCK_SEPARATOR}${markdown}`
                : `## Functions${BLOCK_SEPARATOR}${markdown}`;
        } else {
            const parts = utilityMap.get(target.utility) ?? [];
            parts.push(markdown);
            utilityMap.set(target.utility, parts);
        }
    }

    const utilityPages: UtilityPage[] = [...utilityMap.entries()]
        .map(([utility, parts]) => ({
            content: `# ${UTILITY_TITLES[utility]}${BLOCK_SEPARATOR}${parts.join(BLOCK_SEPARATOR)}`,
            pathSegments: [UTILITIES_DIR, utility],
            title: UTILITY_TITLES[utility],
        }))
        .sort((a, b) => a.pathSegments.join('/').localeCompare(b.pathSegments.join('/')));

    return { functions, utilityPages };
}

/**
 * Render one exported function into its `### name()` markdown block:
 * - build the signature blockquote.
 * - build fn param/return annotations.
 * - append the JSDoc description and any `@example` bodies.
 *
 * @return
 * ### isDecimal()
 *
 * > **isDecimal**(`node`: `NumberTypeNode`): `boolean`
 *
 * Returns true when the number type node encodes a floating-point decimal.
 *
 * ```ts
 * isDecimal(numberTypeNode('f32')); // true
 * ```
 */
export function renderFunction(name: string, fn: FunctionDeclaration): string {
    const typeParams = fn.getTypeParameters().map(p => p.getName());
    const generics = typeParams.length ? `\\<${typeParams.map(p => `\`${p}\``).join(', ')}\\>` : '';
    // Prefer the authored param annotation (concise source text) over the resolved type, so a nested-guard
    // param stays `NestedTypeNode<...>` instead of the compiler expanding the full TypeNode union.
    const params = fn
        .getParameters()
        .map(p => {
            const type = p.getTypeNode()?.getText() ?? p.getType().getText(p);
            return `\`${p.getName()}\`: ${inlineType(type)}`;
        })
        .join(', ');
    // Prefer the authored return annotation.
    // For inferred returns, resolve against the function node,
    // so the compiler prints short imported names instead of absolute `import("/abs/path").Name` forms.
    const returnType = fn.getReturnTypeNode()?.getText() ?? fn.getReturnType().getText(fn);
    const signature = `> **${name}**${generics}(${params}): ${inlineType(returnType)}`;
    const doc = fn.getJsDocs().at(-1);
    return concatParts(`### ${name}()`, signature, description(doc), examples(doc));
}

/**
 * Render one exported type alias into its `### name` markdown block:
 * - build the signature blockquote as `name = <aliased type>` from the source.
 * - append the JSDoc description and any `@example` bodies.
 *
 * @return
 * ### DocsInput
 *
 * > **DocsInput** = `string[] | string`
 *
 * Documentation input accepted by node helpers: either a single string or an array of strings.
 */
function renderTypeAlias(alias: TypeAliasDeclaration): string {
    const name = alias.getName();
    const signature = `> **${name}** = ${inlineType(alias.getTypeNodeOrThrow().getText())}`;
    const doc = alias.getJsDocs().at(-1);
    return concatParts(`### ${name}`, signature, description(doc), examples(doc));
}

/**
 * Collect the body of every `@example` tag from a JSDoc block and join them with blank lines.
 * Returns an empty string when the block has no `@example` tags.
 *
 * @return
 * ```ts
 * isDecimal(numberTypeNode('f32')); // true
 * ```
 */
function examples(doc: JSDoc | undefined): string {
    const parts: string[] = [];
    for (const tag of doc?.getTags() ?? []) {
        if (tag.getTagName() !== 'example') continue;
        const text = tag.getCommentText()?.trim();
        if (text) parts.push(text);
    }
    return parts.join(BLOCK_SEPARATOR);
}

/**
 * Render description if it exists.
 */
function description(doc: JSDoc | undefined): string {
    return doc?.getDescription().trim() ?? '';
}

/**
 * Assemble a rendered block from its parts (e.g. heading, signature, description, examples).
 * Empty parts are dropped and the rest joined with blank lines.
 */
function concatParts(...parts: string[]): string {
    return parts.filter(Boolean).join(BLOCK_SEPARATOR);
}

/**
 * Render a type as inline code:
 * - strip `import("pkg").` qualifiers the compiler adds for inferred returns (authored annotations never carry them).
 * - collapse whitespace runs, then drop the spaces just inside `<`/`>` so a multi-line generic reads on one line.
 *
 * @example
 * inlineType('import("@codama/node-types").BytesTypeNode') // '`BytesTypeNode`'
 * inlineType('NestedTypeNode<\n  TTo\n>')                   // '`NestedTypeNode<TTo>`'
 */
export function inlineType(text: string): string {
    const collapsed = text
        .replace(/import\("[^"]*"\)\./g, '')
        .replace(/\s+/g, ' ')
        .replace(/<\s+/g, '<')
        .replace(/\s+>/g, '>')
        .trim();
    return `\`${collapsed}\``;
}

/**
 * Discover every hand-written module under `packages/nodes/src` (excluding `generated/`) that exports a
 * function or type alias - the full set of files carrying documentable helpers.
 */
export function discoverHelperModuleFiles(): string[] {
    const nodesSrc = join(findRepoRoot(), 'packages', 'nodes', 'src');
    const project = new Project({ skipAddingFilesFromTsConfig: true });
    project.addSourceFilesAtPaths([`${nodesSrc}/**/*.ts`, `!${nodesSrc}/generated/**`]);
    return project
        .getSourceFiles()
        .filter(sf => sf.getFunctions().some(f => f.isExported()) || sf.getTypeAliases().some(a => a.isExported()))
        .map(sf => relative(nodesSrc, sf.getFilePath()))
        .sort();
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
