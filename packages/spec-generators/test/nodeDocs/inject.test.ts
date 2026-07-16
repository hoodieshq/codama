import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { buildContentInjection, getRenderMap, validateInjectKeys } from '../../src/nodeDocs';

// The hook only reads page.kind, page.node.kind and slot, so the rest of the ctx is irrelevant here.
type InjectCtx = Parameters<ReturnType<typeof buildContentInjection>>[0];
const nodeCtx = (kind: string, slot: InjectCtx['slot']): InjectCtx =>
    ({ page: { kind: 'node', node: { kind } }, slot }) as unknown as InjectCtx;

describe('inject - additional content to node docs', () => {
    const account = getFromRenderMap(getRenderMap(getSpec(), { targetSpecMajor: 1 }), 'AccountNode.md').content;

    it('injects the diagram after the description and before Attributes', () => {
        expect(account).toContain('![Diagram]');
        const diagramAt = account.indexOf('![Diagram]');
        // Lower bound: the diagram sits after the page title, not at the very top.
        expect(account.indexOf('# `AccountNode`')).toBeLessThan(diagramAt);
        // Upper bound: the diagram sits before the spec-generated Attributes table.
        expect(diagramAt).toBeLessThan(account.indexOf('## Attributes'));
    });
});

describe('buildContentInjection', () => {
    const inject = buildContentInjection({
        diagrams: { accountNode: '![Diagram](x)' },
        functions: { accountNode: '## Functions\n\n### `accountNode(input)`' },
    });

    it('returns the diagram at the afterDescription slot', () => {
        expect(inject(nodeCtx('accountNode', 'afterDescription'))).toContain('![Diagram]');
    });

    it('returns the functions block at the afterAttributes slot', () => {
        expect(inject(nodeCtx('accountNode', 'afterAttributes'))).toContain('## Functions');
    });

    it('returns undefined for a node kind with no overlay entry', () => {
        expect(inject(nodeCtx('numberTypeNode', 'afterAttributes'))).toBeUndefined();
    });

    it('returns undefined for an unhandled slot', () => {
        expect(inject(nodeCtx('accountNode', 'end'))).toBeUndefined();
    });

    it('returns undefined for a non-node page', () => {
        expect(
            inject({ page: { kind: 'rootIndex' }, slot: 'afterAttributes' } as unknown as InjectCtx),
        ).toBeUndefined();
    });
});

describe('validateInjectKeys', () => {
    it('throws when a diagram key is not a real node kind in the spec', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                diagrams: { notARealNodeKind: '![Diagram](x)' },
                functions: {},
            }),
        ).toThrow(/notARealNodeKind/);
    });

    it('throws when a functions key is not a real node kind in the spec', () => {
        expect(() =>
            validateInjectKeys(getSpec(), {
                diagrams: {},
                functions: { alsoNotARealNodeKind: '## Functions' },
            }),
        ).toThrow(/alsoNotARealNodeKind/);
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
