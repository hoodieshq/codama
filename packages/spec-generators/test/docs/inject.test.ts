import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { getRenderMap, validateInjectKeys } from '../../src/docs';

describe('inject - additional content to node docs', () => {
    const account = getFromRenderMap(getRenderMap(getSpec(), { targetSpecMajor: 1 }), 'AccountNode.md').content;

    it('renders the Functions section with the constructor helper', () => {
        expect(account).toContain('## Functions');
        expect(account).toContain('### `accountNode(input)`');
    });

    it('injects the diagram after the description and before Attributes', () => {
        expect(account).toContain('![Diagram]');
        expect(account.indexOf('![Diagram]')).toBeLessThan(account.indexOf('## Attributes'));
    });

    it('places the Functions section after the Attributes table', () => {
        expect(account.indexOf('## Attributes')).toBeLessThan(account.indexOf('## Functions'));
    });

    it('renders Functions before the spec native Examples section', () => {
        expect(account.indexOf('## Functions')).toBeLessThan(account.indexOf('## Examples'));
    });

    it('omits the Functions section for a node kind with no overlay entry', () => {
        const noOverlay = getFromRenderMap(
            getRenderMap(getSpec(), { targetSpecMajor: 1 }),
            'displayNodes/StringDisplayNode.md',
        ).content;
        expect(noOverlay).not.toContain('## Functions');
    });

    it('renders NumberTypeNode Functions with the type-guard helpers', () => {
        const map = getRenderMap(getSpec(), { targetSpecMajor: 1 });
        const number = getFromRenderMap(map, 'typeNodes/NumberTypeNode.md').content;
        expect(number).toContain('## Functions');
        expect(number).toContain('### `isSignedInteger(node)`');
    });
});

describe('validateInjectKeys', () => {
    it('throws when an overlay key is not a real node kind in the spec', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                diagrams: { notARealNodeKind: '![Diagram](x)' },
                functions: {},
            }),
        ).toThrow(/notARealNodeKind/);
    });

    it('accepts overlay maps whose keys are all real node kinds', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                diagrams: { accountNode: '![Diagram](x)' },
                functions: {},
            }),
        ).not.toThrow();
    });
});
