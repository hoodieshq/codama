import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { getRenderMap, validateInjectKeys } from '../../src/docs';

describe('inject overlays', () => {
    const account = getFromRenderMap(getRenderMap(getSpec(), { targetSpecMajor: 1 }), 'AccountNode.md').content;

    it('renders the ported Functions section with the constructor helper', () => {
        expect(account).toContain('## Functions');
        expect(account).toContain('### `accountNode(input)`');
    });

    it('renders the ported Examples section', () => {
        expect(account).toContain('## Examples');
        expect(account).toContain('### A fixed-size account');
    });

    it('orders Functions before Examples within the end slot', () => {
        expect(account.indexOf('## Functions')).toBeLessThan(account.indexOf('## Examples'));
    });

    it('places the end-slot overlays after the spec Attributes section', () => {
        expect(account.indexOf('## Attributes')).toBeLessThan(account.indexOf('## Functions'));
    });

    it('injects the diagram after the description and before Attributes', () => {
        expect(account).toContain('![Diagram]');
        expect(account.indexOf('![Diagram]')).toBeLessThan(account.indexOf('## Attributes'));
    });

    it('omits both sections for a node kind with no overlay entry', () => {
        const noOverlay = getFromRenderMap(
            getRenderMap(getSpec(), { targetSpecMajor: 1 }),
            'typeNodes/BooleanTypeNode.md',
        ).content;
        expect(noOverlay).not.toContain('## Examples');
    });
});

describe('validateInjectKeys', () => {
    it('throws when an overlay key is not a real node kind in the spec', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                localDiagrams: { notARealNodeKind: '![Diagram](x)' },
                localExamples: {},
                localFunctions: {},
            }),
        ).toThrow(/notARealNodeKind/);
    });

    it('accepts overlay maps whose keys are all real node kinds', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                localDiagrams: { accountNode: '![Diagram](x)' },
                localExamples: {},
                localFunctions: {},
            }),
        ).not.toThrow();
    });
});
