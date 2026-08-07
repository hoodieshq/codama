import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { extractTsdocDocs, getRenderMap, validateRenderOptions } from '../../src/nodeDocs';

const spec = getSpec();
const docs = extractTsdocDocs();

describe('validateRenderOptions', () => {
    it('throws when targetSpecMajor does not match the spec major', () => {
        expect(() => validateRenderOptions(spec, { targetSpecMajor: 2 })).toThrow(/targetSpecMajor=2/);
    });

    it('accepts a matching major and the built-in category directories', () => {
        expect(() => validateRenderOptions(spec, { targetSpecMajor: 1 })).not.toThrow();
    });

    it('throws when a supplied categoryDirectories map omits a spec category', () => {
        expect(() =>
            validateRenderOptions(spec, {
                categoryDirectories: new Map([['type', 'typeNodes']]),
                targetSpecMajor: 1,
            }),
        ).toThrow(/categoryDirectories is missing an entry/);
    });
});

describe('getRenderMap', () => {
    const map = getRenderMap(spec, { targetSpecMajor: 1 }, docs);

    it('produces a markdown entry per spec page, including subdirectory and index pages', () => {
        expect(map.has('AccountNode.md')).toBe(true);
        expect(map.has('typeNodes/NumberTypeNode.md')).toBe(true);
        expect(map.has('typeNodes/README.md')).toBe(true);
        expect(map.has('sharedNodes/BytesEncoding.md')).toBe(true);
        expect(map.has('README.md')).toBe(true);
    });

    it('keys every entry with a .md suffix', () => {
        for (const key of map.keys()) expect(key).toMatch(/\.md$/);
    });

    it('replaces the spec-derived body with a link to the spec', () => {
        const { content } = getFromRenderMap(map, 'AccountNode.md');
        expect(content).toContain('# `AccountNode`');
        expect(content).toContain('https://github.com/codama-idl/spec/blob/main/docs/AccountNode.md');
        expect(content).not.toContain('## Attributes');
        expect(content).not.toContain('## Examples');
    });

    it('keeps the TSDoc functions block on nodes that have documented helpers', () => {
        expect(getFromRenderMap(map, 'ProgramNode.md').content).toContain('## Functions');
        expect(getFromRenderMap(map, 'typeNodes/NumberTypeNode.md').content).toContain('### isDecimal()');
    });

    it('emits the standalone utility pages untouched', () => {
        expect(map.has('utilities/NestedTypeNode.md')).toBe(true);
        expect(map.has('utilities/Node.md')).toBe(true);
        expect(map.has('utilities/Shared.md')).toBe(true);
    });

    it('records the spec version on the root index', () => {
        const { content } = getFromRenderMap(map, 'README.md');
        expect(content).toContain(`Generated from \`@codama/spec\` ${spec.version}.`);
        expect(content).toContain('## Utilities');
    });

    it('appends exactly one trailing newline to each page', () => {
        const { content } = getFromRenderMap(map, 'AccountNode.md');
        expect(content.endsWith('\n')).toBe(true);
        expect(content.endsWith('\n\n')).toBe(false);
    });

    it('emits a frozen render map', () => {
        expect(Object.isFrozen(map)).toBe(true);
    });

    it('throws when the extracted docs carry a functions block for an unknown node kind', () => {
        expect(() =>
            getRenderMap(spec, { targetSpecMajor: 1 }, { ...docs, functions: { ghostNode: '## Functions' } }),
        ).toThrow(/ghostNode/);
    });
});
