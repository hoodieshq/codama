import { getFromRenderMap } from '@codama/fragments';
import { getSpec } from '@codama/spec';
import { describe, expect, it } from 'vitest';

import { buildContentInjection, extractTsdocDocs, getRenderMap, validateInjectKeys } from '../../src/nodeDocs';

const docs = extractTsdocDocs();

// The hook only reads page.kind, page.node.kind and slot, so the rest of the ctx is irrelevant here.
type InjectCtx = Parameters<ReturnType<typeof buildContentInjection>>[0];
const nodeCtx = (kind: string, slot: InjectCtx['slot']): InjectCtx =>
    ({ page: { kind: 'node', node: { kind } }, slot }) as unknown as InjectCtx;

const page = (map: ReturnType<typeof getRenderMap>, path: string): string => getFromRenderMap(map, path).content;

describe('injects', () => {
    const map = getRenderMap(getSpec(), { targetSpecMajor: 1 }, docs);

    it('injects the diagram after the description and before Attributes', () => {
        const account = page(map, 'AccountNode.md');
        expect(account).toContain('![Diagram]');
        const diagramAt = account.indexOf('![Diagram]');
        // Lower bound: the diagram sits after the page title, not at the very top.
        expect(account.indexOf('# `AccountNode`')).toBeLessThan(diagramAt);
        // Upper bound: the diagram sits before the spec-generated Attributes table.
        expect(diagramAt).toBeLessThan(account.indexOf('## Attributes'));
    });

    it('renders the Examples section after Attributes', () => {
        const account = page(map, 'AccountNode.md');
        expect(account).toContain('## Examples');
        expect(account).toContain('### A fixed-size account');
        expect(account.indexOf('## Attributes')).toBeLessThan(account.indexOf('## Examples'));
    });

    it('drops the Functions section when the only helper was the generated constructor', () => {
        // accountNode has no hand-written helper, so TSDoc extraction yields no Functions block for it.
        expect(page(map, 'AccountNode.md')).not.toContain('## Functions');
    });

    it('omits all overlays for a node kind with no diagram/examples/functions', () => {
        const noOverlay = page(map, 'displayNodes/StringDisplayNode.md');
        expect(noOverlay).not.toContain('## Functions');
    });

    it('renders NumberTypeNode Functions from the source helpers', () => {
        const number = page(map, 'typeNodes/NumberTypeNode.md');
        expect(number).toContain('## Functions');
        expect(number).toContain('isSignedInteger');
        // The helper's @example content is carried through from the TSDoc.
        expect(number).toContain("numberTypeNode('i32')");
    });

    it('orders Attributes -> Functions -> Examples on a node that has both', () => {
        const number = page(map, 'typeNodes/NumberTypeNode.md');
        expect(number.indexOf('## Attributes')).toBeLessThan(number.indexOf('## Functions'));
        expect(number.indexOf('## Functions')).toBeLessThan(number.indexOf('## Examples'));
    });

    it('emits a Node type-guards utility page', () => {
        expect(map.has('utilities/Node.md')).toBe(true);
        expect(page(map, 'utilities/Node.md')).toContain('isNode');
    });

    it('links every emitted utility page from the root index with its title and a root-relative href', () => {
        const readme = page(map, 'README.md');
        const utilityPaths = [...map.keys()].filter(key => key.startsWith('utilities/'));
        expect(utilityPaths.length).toBeGreaterThan(0);
        expect(readme).toContain('## Utilities');
        for (const path of utilityPaths) {
            // The link label is the utility page's own H1 title, so the full markdown link must match.
            const title = page(map, path).match(/^# (.+)$/m)![1];
            expect(readme).toContain(`[${title}](./${path})`);
        }
    });
});

describe('buildContentInjection', () => {
    const inject = buildContentInjection({
        diagrams: { accountNode: '![Diagram](x)' },
        functions: { accountNode: '## Functions\n\n### `accountNode(input)`' },
        utilityPages: [],
    });

    // Minimal markup fake: the rootIndex `end` path only calls `heading` and `link`.
    const markup = {
        heading: (level: number, content: string) => `${'#'.repeat(level)} ${content}`,
        link: (text: string, href: string) => `[${text}](${href})`,
    };
    const endSlot = (inj: ReturnType<typeof buildContentInjection>): string | undefined =>
        inj({ markup, page: { kind: 'rootIndex' }, slot: 'end' } as unknown as InjectCtx);

    it('returns the diagram at the afterDescription slot', () => {
        expect(inject(nodeCtx('accountNode', 'afterDescription'))).toContain('![Diagram]');
    });

    it('returns the functions block at the afterAttributes slot', () => {
        expect(inject(nodeCtx('accountNode', 'afterAttributes'))).toContain('## Functions');
    });

    it('returns undefined for a node kind with no overlay entry', () => {
        expect(inject(nodeCtx('numberTypeNode', 'afterAttributes'))).toBeUndefined();
    });

    it('returns undefined for an unhandled node slot', () => {
        expect(inject(nodeCtx('accountNode', 'end'))).toBeUndefined();
    });

    it('returns undefined for a non-node page outside its slot', () => {
        expect(
            inject({ page: { kind: 'rootIndex' }, slot: 'afterAttributes' } as unknown as InjectCtx),
        ).toBeUndefined();
    });

    it('renders the Utilities section with root-relative links at the rootIndex end slot', () => {
        const withPages = buildContentInjection({
            diagrams: {},
            functions: {},
            utilityPages: [{ pathSegments: ['utilities', 'Node'], title: 'Node type guards' }],
        });
        const out = endSlot(withPages);
        expect(out).toContain('## Utilities');
        expect(out).toContain('[Node type guards](./utilities/Node.md)');
    });

    it('returns undefined at the rootIndex end slot when there are no utility pages', () => {
        expect(endSlot(inject)).toBeUndefined();
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
                functions: { numberTypeNode: '## Functions' },
            }),
        ).not.toThrow();
    });
});
