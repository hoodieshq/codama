import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { getRenderMap, validateRenderOptions } from '../../src/nodeDocs';

describe('validateRenderOptions', () => {
    it('throws when targetSpecMajor does not match the spec major', () => {
        expect(() => validateRenderOptions(getSpec(), { targetSpecMajor: 2 })).toThrow(/targetSpecMajor=2/);
    });

    it('accepts a matching major', () => {
        expect(() => validateRenderOptions(getSpec(), { targetSpecMajor: 1 })).not.toThrow();
    });
});

describe('getRenderMap', () => {
    const map = getRenderMap(getSpec(), { targetSpecMajor: 1 });

    it('produces a markdown entry per spec page, including subdir + index pages', () => {
        expect(map.has('AccountNode.md')).toBe(true);
        expect(map.has('typeNodes/NumberTypeNode.md')).toBe(true);
        expect(map.has('README.md')).toBe(true);
    });

    it('keys every entry with a .md suffix', () => {
        for (const key of map.keys()) expect(key).toMatch(/\.md$/);
    });

    it('renders the node title and the spec-generated Attributes section', () => {
        const entry = getFromRenderMap(map, 'AccountNode.md');
        expect(entry.content).toContain('# `AccountNode`');
        expect(entry.content).toContain('## Attributes');
    });

    it('appends a single trailing newline to each page', () => {
        expect(getFromRenderMap(map, 'AccountNode.md').content.endsWith('\n')).toBe(true);
    });

    it('emits a frozen render map', () => {
        expect(Object.isFrozen(map)).toBe(true);
    });
});
