import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { generateDocs as generateSpecDocs, LocalDocsPathConfig, relativeLinks } from '@codama/spec/docs';
import { describe, expect, it } from 'vitest';

import { getRenderMap, validateRenderOptions } from '../../src/nodeDocs';

describe('validateRenderOptions', () => {
    it('throws when targetSpecMajor does not match the spec major', () => {
        expect(() => validateRenderOptions(getSpec(), { targetSpecMajor: 2 })).toThrow(/targetSpecMajor=2/);
    });

    it('accepts a matching major', () => {
        expect(() => validateRenderOptions(getSpec(), { targetSpecMajor: 1 })).not.toThrow();
    });

    it('throws on a malformed spec version', () => {
        const broken = { ...getSpec(), version: 'not-a-version' };
        expect(() => validateRenderOptions(broken, { targetSpecMajor: 1 })).toThrow(
            /unable to parse spec version "not-a-version"/,
        );
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

    it('appends exactly one trailing newline to every page', () => {
        for (const key of map.keys()) {
            const content = getFromRenderMap(map, key).content;
            expect(content.endsWith('\n')).toBe(true);
            expect(content.endsWith('\n\n')).toBe(false);
        }
    });

    it('emits one map entry per spec page', () => {
        const model = generateSpecDocs(getSpec(), {
            linkStrategy: relativeLinks('md'),
            pathConfig: LocalDocsPathConfig,
        });
        expect(map.size).toBe(model.pages.length);
    });

    it('renders cross-page references as relative .md links', () => {
        expect(getFromRenderMap(map, 'AccountNode.md').content).toContain(
            '[`StructTypeNode`](./typeNodes/StructTypeNode.md)',
        );
    });

    it('emits a frozen render map', () => {
        expect(Object.isFrozen(map)).toBe(true);
    });
});
