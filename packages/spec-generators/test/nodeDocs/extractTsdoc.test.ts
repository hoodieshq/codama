import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import {
    discoverHelperModuleFiles,
    ENTRY_MODULES,
    extractTsdocDocs,
    inlineType,
    renderFunction,
} from '../../src/nodeDocs/extractTsdoc';

/** Build a `FunctionDeclaration` from inline source so renderFunction can be unit-tested without the nodes package. */
function firstFunctionFromSource(source: string) {
    const sourceFile = new Project({ useInMemoryFileSystem: true }).createSourceFile('t.ts', source);
    return sourceFile.getFunctions()[0];
}

/** Every `### name` heading in a markdown block, sorted - used to assert the documented surface. */
function headings(md: string): string[] {
    return [...md.matchAll(/^### (.+)$/gm)].map(m => m[1].replace(/\(\)$/, '')).sort();
}

const docs = extractTsdocDocs();
const pathOf = (p: { pathSegments: readonly string[] }): string => p.pathSegments.join('/');

// Hand-written modules that export helpers but are intentionally NOT documented. Keep empty; add with a reason.
const IGNORED_MODULES = new Set<string>();

describe('extractTsdocDocs', () => {
    it('documents the expected node kinds', () => {
        expect(Object.keys(docs.functions).sort()).toEqual([
            'constantPdaSeedNode',
            'constantValueNode',
            'enumTypeNode',
            'instructionArgumentNode',
            'instructionNode',
            'numberTypeNode',
            'programNode',
        ]);
    });

    it('emits the standalone utility pages', () => {
        expect(docs.utilityPages.map(pathOf).sort()).toEqual([
            'utilities/NestedTypeNode',
            'utilities/Node',
            'utilities/Shared',
        ]);
    });

    it('keeps nested-guard signatures concise instead of expanding the full TypeNode union', () => {
        const page = docs.utilityPages.find(p => pathOf(p) === 'utilities/NestedTypeNode')!;
        // ts-morph uses the authored source text, so the concise annotation survives.
        expect(page.content).not.toContain('SolAmountTypeNode');
        expect(page.content).toContain('NestedTypeNode<Extract<TypeNode, { kind: TKind }>>');
    });

    it('renders parameters with their authored types', () => {
        expect(docs.functions.numberTypeNode).toContain('**isSignedInteger**(`node`: `NumberTypeNode`): `boolean`');
        const nestedPage = docs.utilityPages.find(p => pathOf(p) === 'utilities/NestedTypeNode')!;
        expect(nestedPage.content).toContain('(`typeNode`: `NestedTypeNode<TFrom>`, `map`: `(type: TFrom) => TTo`)');
    });

    it('carries the description and example through', () => {
        expect(docs.functions.numberTypeNode).toContain('### isSignedInteger()');
        expect(docs.functions.numberTypeNode).toContain('signed integer');
        expect(docs.functions.numberTypeNode).toContain("numberTypeNode('i32')");
    });

    it('renders type-alias blocks with their aliased type', () => {
        const shared = docs.utilityPages.find(p => pathOf(p) === 'utilities/Shared')!.content;
        expect(headings(shared)).toContain('DocsInput');
        expect(shared).toContain('> **DocsInput** = `string[] | string`');
    });

    it('merges helpers from multiple source files onto the same utility page', () => {
        // The Shared page is fed by both shared/docs.ts and shared/stringCases.ts, so both must land on it.
        const shared = docs.utilityPages.find(p => pathOf(p) === 'utilities/Shared')!.content;
        expect(headings(shared)).toEqual(expect.arrayContaining(['DocsInput', 'parseDocs', 'pascalCase']));
    });

    it('renders a helper own generic clause on the utility page', () => {
        const nodePage = docs.utilityPages.find(p => pathOf(p) === 'utilities/Node')!.content;
        expect(nodePage).toContain('**isNode**\\<`TKind`\\>');
    });

    it('merges multiple helpers under a single "## Functions" heading per kind', () => {
        const block = docs.functions.numberTypeNode;
        expect(block.match(/^## Functions$/gm)).toHaveLength(1);
        expect((block.match(/^### /gm) ?? []).length).toBeGreaterThan(1);
    });

    it('separates blocks with a single blank line (no doubled gaps)', () => {
        const shared = docs.utilityPages.find(p => pathOf(p) === 'utilities/Shared')!.content;
        expect(docs.functions.numberTypeNode).not.toContain('\n\n\n');
        expect(shared).not.toContain('\n\n\n');
    });

    it('registers every hand-written helper module in ENTRY_MODULES', () => {
        const registered = new Set<string>(ENTRY_MODULES.map(m => m.file));
        const unregistered = discoverHelperModuleFiles().filter(f => !registered.has(f) && !IGNORED_MODULES.has(f));
        expect(
            unregistered,
            `Unregistered helper modules -> add to ENTRY_MODULES (or IGNORED_MODULES): ${unregistered.join(', ')}`,
        ).toEqual([]);
    });
});

describe('inlineType', () => {
    it('strips the compiler-added import() qualifier', () => {
        expect(inlineType('import("@codama/node-types").BytesTypeNode')).toBe('`BytesTypeNode`');
    });

    it('collapses a multi-line generic onto one line with no spaces inside the angle brackets', () => {
        expect(inlineType('NestedTypeNode<\n  TTo\n>')).toBe('`NestedTypeNode<TTo>`');
    });

    it('preserves the spacing of a function type', () => {
        expect(inlineType('(type: TFrom) => TTo')).toBe('`(type: TFrom) => TTo`');
    });
});

describe('renderFunction', () => {
    it('renders the type-parameter clause of a generic helper', () => {
        const fn = firstFunctionFromSource('export function single<T>(x: T): T { return x; }');
        expect(renderFunction('single', fn)).toContain('**single**\\<`T`\\>');
    });

    it('joins multiple type parameters in the generic clause', () => {
        const fn = firstFunctionFromSource(
            'export function pair<TFrom, TTo>(x: TFrom): TTo { return x as unknown as TTo; }',
        );
        expect(renderFunction('pair', fn)).toContain('**pair**\\<`TFrom`, `TTo`\\>');
    });

    it('renders a helper with no JSDoc as heading + signature only, with no doubled gaps', () => {
        const fn = firstFunctionFromSource('export function noDocs(): void {}');
        const md = renderFunction('noDocs', fn);
        expect(md).toBe('### noDocs()\n\n> **noDocs**(): `void`');
        expect(md).not.toContain('\n\n\n');
    });

    it('drops an empty @example body instead of emitting a doubled gap', () => {
        const fn = firstFunctionFromSource('/**\n * A helper.\n * @example\n */\nexport function docOnly(): void {}');
        const md = renderFunction('docOnly', fn);
        expect(md).toContain('A helper.');
        expect(md).not.toContain('\n\n\n');
    });
});
