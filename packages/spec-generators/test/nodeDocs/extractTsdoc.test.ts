import { describe, expect, it } from 'vitest';

import { extractTsdocDocs } from '../../src/nodeDocs/extractTsdoc';

/** Every `### name` heading in a markdown block, sorted - used to assert the documented surface. */
function headings(md: string): string[] {
    return [...md.matchAll(/^### (.+)$/gm)].map(m => m[1].replace(/\(\)$/, '')).sort();
}

const docs = await extractTsdocDocs();
const pathOf = (p: { pathSegments: readonly string[] }): string => p.pathSegments.join('/');
const utility = (id: string): string => docs.utilityPages.find(p => pathOf(p) === `utilities/${id}`)!.content;

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

    it('titles each utility page, since TypeDoc emits no page title of its own', () => {
        expect(utility('Node').startsWith('# Node type guards\n\n')).toBe(true);
        expect(docs.utilityPages.map(p => p.title).sort()).toEqual([
            'Nested type node helpers',
            'Node type guards',
            'Shared utilities',
        ]);
    });

    it('carries the description and example through', () => {
        expect(docs.functions.numberTypeNode).toContain('### isSignedInteger()');
        expect(docs.functions.numberTypeNode).toContain('signed integer');
        expect(docs.functions.numberTypeNode).toContain("numberTypeNode('i32')");
    });

    it('renders the authored return annotation, not the type the checker resolves', () => {
        // `getAllPrograms` is annotated `: ProgramNode[]`. Resolved, that expands every defaulted type
        // argument of ProgramNode into thousands of characters.
        expect(docs.functions.programNode).toContain('> **getAllPrograms**(`node`): `ProgramNode`[]');
        expect(docs.functions.programNode).not.toContain('RegisteredPdaSeedNode');
    });

    it('renders the authored parameter annotation', () => {
        expect(docs.functions.programNode).toContain('`ProgramNode` \\| `ProgramNode`[] \\| `RootNode`');
    });

    it('keeps nested-guard signatures concise instead of expanding the full TypeNode union', () => {
        const page = utility('NestedTypeNode');
        expect(page).toContain('`node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>>`');
        expect(page).not.toContain('SolAmountTypeNode');
    });

    it('renders the authored type-parameter constraint rather than its expansion', () => {
        // `TKind extends NodeKind` resolves to ninety-odd node-kind string literals. Asserted against
        // TypeDoc's raw emphasis markers, since prettier only normalises `*extends*` once the file is written.
        expect(utility('Node')).toContain('`TKind` *extends* `NodeKind`');
        expect(utility('Node')).not.toContain('"accountNode"');
    });

    it('renders type-alias blocks under their own group heading', () => {
        expect(utility('Shared')).toContain('## Type Aliases');
        expect(headings(utility('Shared'))).toContain('DocsInput');
    });

    it('merges helpers from both shared modules onto one page under a single Functions heading', () => {
        // Fed by shared/docs.ts and shared/stringCases.ts via the barrel, so both must land here exactly once.
        const shared = utility('Shared');
        expect(headings(shared)).toEqual(expect.arrayContaining(['DocsInput', 'parseDocs', 'pascalCase']));
        expect(shared.match(/^## Functions$/gm)).toHaveLength(1);
    });

    it('opens each node-kind block with a single "## Functions" heading', () => {
        const block = docs.functions.numberTypeNode;
        expect(block.startsWith('## Functions')).toBe(true);
        expect(block.match(/^## Functions$/gm)).toHaveLength(1);
        expect((block.match(/^### /gm) ?? []).length).toBeGreaterThan(1);
    });
});
