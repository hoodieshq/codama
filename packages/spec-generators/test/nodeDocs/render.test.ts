import { describe, expect, it } from 'vitest';

import { SPEC_DOCS_BASE_URL } from '../../src/nodeDocs/constants';
import type { UtilityPage } from '../../src/nodeDocs/extractTsdoc';
import type { CategoryPage, EntityKind, EntityPage } from '../../src/nodeDocs/pages';
import {
    entityTitle,
    renderCategoryIndex,
    renderEntityPage,
    renderRootIndex,
    specDocsUrl,
} from '../../src/nodeDocs/render';

function entity(entityKind: EntityKind, displayName: string, directory = 'typeNodes'): EntityPage {
    return {
        entityKind,
        name: displayName.charAt(0).toLowerCase() + displayName.slice(1),
        pathSegments: directory === '' ? [displayName] : [directory, displayName],
    };
}

function category(overrides: Partial<CategoryPage> = {}): CategoryPage {
    return {
        directory: 'typeNodes',
        entities: [entity('node', 'AmountTypeNode'), entity('union', 'TypeNode')],
        name: 'type',
        title: 'Type',
        ...overrides,
    };
}

const utilityPages: readonly UtilityPage[] = [
    { content: '# Node type guards', pathSegments: ['utilities', 'Node'], title: 'Node type guards' },
];

function entityPage(entityKind: EntityKind, displayName: string): EntityPage {
    return { entityKind, name: displayName, pathSegments: [displayName] };
}

describe('specDocsUrl', () => {
    it('maps local path segments positionally onto the spec docs tree', () => {
        expect(specDocsUrl(['typeNodes', 'NumberTypeNode'])).toBe(`${SPEC_DOCS_BASE_URL}/typeNodes/NumberTypeNode.md`);
        expect(specDocsUrl(['README'])).toBe(`${SPEC_DOCS_BASE_URL}/README.md`);
    });
});

describe('renderEntityPage', () => {
    it('renders the heading and the spec pointer for an entity with no helpers', () => {
        expect(renderEntityPage(entity('node', 'AmountTypeNode'), undefined)).toBe(
            '# `AmountTypeNode`\n\n' +
                `See the [\`AmountTypeNode\` specification](${SPEC_DOCS_BASE_URL}/typeNodes/AmountTypeNode.md).`,
        );
    });

    it('appends the TSDoc functions block when the node has documented helpers', () => {
        const markdown = renderEntityPage(entity('node', 'NumberTypeNode'), '## Functions\n\n### isDecimal()');
        expect(markdown).toContain('## Functions');
        expect(markdown).toContain('### isDecimal()');
        expect(markdown).not.toContain('\n\n\n');
    });

    it('keeps the kind suffix out of the link label', () => {
        const markdown = renderEntityPage(entity('union', 'TypeNode'), undefined);
        expect(markdown).toContain('# `TypeNode` (abstract)');
        expect(markdown).toContain('[`TypeNode` specification]');
        expect(markdown).not.toContain('(abstract) specification');
    });

    it('marks a nested union (recursive) in the heading only', () => {
        const markdown = renderEntityPage(entity('nestedUnion', 'NestedTypeNode'), undefined);
        expect(markdown).toContain('# `NestedTypeNode` (recursive)');
        expect(markdown).toContain('[`NestedTypeNode` specification]');
    });

    it('points a root-level entity at the spec docs root', () => {
        const markdown = renderEntityPage(entity('node', 'AccountNode', ''), undefined);
        expect(markdown).toContain(`${SPEC_DOCS_BASE_URL}/AccountNode.md`);
    });
});

describe('renderCategoryIndex', () => {
    it('lists each non-empty group under its heading, in group order', () => {
        expect(renderCategoryIndex(category())).toBe(
            [
                '# Type',
                '## Nodes',
                '- [`AmountTypeNode`](./AmountTypeNode.md)',
                '## Unions',
                '- [`TypeNode`](./TypeNode.md)',
                `See the [Type specification](${SPEC_DOCS_BASE_URL}/typeNodes/README.md).`,
            ].join('\n\n'),
        );
    });

    it('omits a group heading when the category has no entity of that kind', () => {
        const markdown = renderCategoryIndex(category());
        expect(markdown).not.toContain('## Nested unions');
        expect(markdown).not.toContain('## Enumerations');
    });

    it('renders enumerations under their own heading', () => {
        const shared = category({
            directory: 'sharedNodes',
            entities: [entity('enumeration', 'BytesEncoding', 'sharedNodes')],
            name: 'shared',
            title: 'Shared',
        });
        expect(renderCategoryIndex(shared)).toContain('## Enumerations');
        expect(renderCategoryIndex(shared)).toContain('- [`BytesEncoding`](./BytesEncoding.md)');
    });
});

describe('renderRootIndex', () => {
    const topLevel = category({
        directory: '',
        entities: [entity('node', 'AccountNode', '')],
        name: 'topLevel',
        title: 'TopLevel',
    });

    it('renders the title, the spec pointer, and the provenance line', () => {
        const markdown = renderRootIndex([category(), topLevel], '1.8.0', utilityPages);
        expect(markdown.startsWith('# Codama nodes\n\n')).toBe(true);
        expect(markdown).toContain(`[Codama specification](${SPEC_DOCS_BASE_URL}/README.md)`);
        expect(markdown).toContain('Generated from `@codama/spec` 1.8.0.');
    });

    it('lists categories without backticks and entities with them', () => {
        const markdown = renderRootIndex([category(), topLevel], '1.8.0', utilityPages);
        expect(markdown).toContain('## Categories');
        expect(markdown).toContain('- [Type](./typeNodes/README.md)');
        expect(markdown).toContain('## TopLevel');
        expect(markdown).toContain('- [`AccountNode`](./AccountNode.md)');
    });

    it('lists the utility pages by title', () => {
        const markdown = renderRootIndex([category(), topLevel], '1.8.0', utilityPages);
        expect(markdown).toContain('## Utilities');
        expect(markdown).toContain('- [Node type guards](./utilities/Node.md)');
    });

    it('keeps the top-level category out of the Categories list', () => {
        const markdown = renderRootIndex([category(), topLevel], '1.8.0', utilityPages);
        // Its entities are listed under the "## TopLevel" heading instead, so it must never appear as a link.
        expect(markdown).not.toContain('- [TopLevel]');
    });
});

describe('entityTitle', () => {
    it('leaves node and enumeration titles unsuffixed', () => {
        expect(entityTitle(entityPage('node', 'AccountNode'))).toBe('`AccountNode`');
        expect(entityTitle(entityPage('enumeration', 'BytesEncoding'))).toBe('`BytesEncoding`');
    });

    it('marks unions (abstract)', () => {
        expect(entityTitle(entityPage('union', 'TypeNode'))).toBe('`TypeNode` (abstract)');
    });

    it('marks nested unions (recursive)', () => {
        expect(entityTitle(entityPage('nestedUnion', 'NestedTypeNode'))).toBe('`NestedTypeNode` (recursive)');
    });
});
