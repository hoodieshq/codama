import type { Spec } from '@codama/spec';
import {
    defineCategory,
    defineEnumeration,
    defineNestedUnion,
    defineNode,
    defineUnion,
    node,
    variant,
} from '@codama/spec/api';
import { describe, expect, it } from 'vitest';

import { DOCS_CATEGORY_DIRECTORIES } from '../../src/nodeDocs/constants';
import { buildPageInventory } from '../../src/nodeDocs/pages';

function buildSpec(categories: Spec['categories']): Spec {
    return { categories, version: '1.0.0' };
}

// Unions are declared out of alphabetical order on purpose: the docs tree sorts them, the spec does not.
const typeCategory = defineCategory('type', {
    nestedUnions: [
        defineNestedUnion('nestedTypeNode', { base: node('numberTypeNode'), wrappers: ['fixedSizeTypeNode'] }),
    ],
    nodes: [defineNode('numberTypeNode', { attributes: [] }), defineNode('amountTypeNode', { attributes: [] })],
    unions: [
        defineUnion('typeNode', { members: ['numberTypeNode'] }),
        defineUnion('registeredTypeNode', { members: ['numberTypeNode'] }),
    ],
});

describe('buildPageInventory', () => {
    it('groups entities as nodes, unions, nested unions, enumerations and sorts each group by display name', () => {
        const [category] = buildPageInventory(buildSpec([typeCategory]), DOCS_CATEGORY_DIRECTORIES);
        expect(category.directory).toBe('typeNodes');
        expect(category.title).toBe('Type');
        expect(category.entities.map(entity => entity.pathSegments.join('/'))).toEqual([
            'typeNodes/AmountTypeNode',
            'typeNodes/NumberTypeNode',
            'typeNodes/RegisteredTypeNode',
            'typeNodes/TypeNode',
            'typeNodes/NestedTypeNode',
        ]);
    });

    it('files top-level entities at the docs root', () => {
        const spec = buildSpec([
            defineCategory('topLevel', { nodes: [defineNode('accountNode', { attributes: [] })] }),
        ]);
        const [category] = buildPageInventory(spec, DOCS_CATEGORY_DIRECTORIES);
        expect(category.directory).toBe('');
        expect(category.entities[0].pathSegments).toEqual(['AccountNode']);
    });

    it('files the shared category under sharedNodes/, unlike the source-output mapping', () => {
        const spec = buildSpec([
            defineCategory('shared', {
                enumerations: [defineEnumeration('bytesEncoding', { variants: [variant('utf8')] })],
            }),
        ]);
        const [category] = buildPageInventory(spec, DOCS_CATEGORY_DIRECTORIES);
        expect(category.entities[0].pathSegments).toEqual(['sharedNodes', 'BytesEncoding']);
    });

    it('sorts categories by title regardless of spec declaration order', () => {
        const spec = buildSpec([defineCategory('value'), defineCategory('count'), defineCategory('type')]);
        const titles = buildPageInventory(spec, DOCS_CATEGORY_DIRECTORIES).map(category => category.title);
        expect(titles).toEqual(['Count', 'Type', 'Value']);
    });

    it('carries the spec name so the TSDoc functions record can be looked up by node kind', () => {
        const [category] = buildPageInventory(buildSpec([typeCategory]), DOCS_CATEGORY_DIRECTORIES);
        expect(category.entities[0].name).toBe('amountTypeNode');
    });

    it('throws when a spec category has no configured docs directory', () => {
        expect(() => buildPageInventory(buildSpec([defineCategory('brandNew')]), DOCS_CATEGORY_DIRECTORIES)).toThrow(
            /brandNew/,
        );
    });
});
