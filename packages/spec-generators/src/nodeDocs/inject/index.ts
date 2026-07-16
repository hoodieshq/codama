/**
 * Per-node documentation overlays for the spec-generated pages.
 * The spec docs generator owns each page title, description, Attributes table and Examples section.
 * TS-specific content lives here instead: diagrams and the Functions section.
 * Diagrams come from the sibling `diagrams` map. The Functions blocks and the standalone utility
 * pages are extracted from source TSDoc (see `../extractTsdoc`) and passed in as `deps`.
 * `buildContentInjection` returns the inject hook that places them into the page slots.
 * Diagrams go to the `afterDescription` slot. Functions to the `afterAttributes` slot.
 * `validateInjectKeys` fails the run when an overlay map is keyed by an unknown node kind.
 */

import type { Spec } from '@codama/spec';
import type { InjectContent, MarkupRenderer } from '@codama/spec/docs';

import { BLOCK_SEPARATOR, DOC_EXT } from '../constants';
import type { UtilityPage } from '../extractTsdoc';

export { diagrams } from './diagrams';

interface InjectDeps {
    readonly diagrams: Record<string, string>;
    /** `## Functions` block per node kind, extracted from source TSDoc. */
    readonly functions: Record<string, string>;
    /** Standalone utility pages to link from the root index. Only the link fields are needed here. */
    readonly utilityPages: readonly Pick<UtilityPage, 'pathSegments' | 'title'>[];
}

/**
 * Inject string content into the spec-generated pages.
 * - Diagrams at `afterDescription`.
 * - Functions at `afterAttributes` (before the spec's native Examples).
 * - Utility links at the root index `end`.
 */
export function buildContentInjection(deps: InjectDeps): InjectContent {
    return ({ markup, page, slot }) => {
        if (page.kind === 'node') {
            const kind = page.node.kind;
            if (slot === 'afterDescription') return deps.diagrams[kind];
            if (slot === 'afterAttributes') return deps.functions[kind];
            return undefined;
        }
        if (page.kind === 'rootIndex' && slot === 'end') {
            return utilityLinksSection(deps, markup);
        }
        return undefined;
    };
}

/**
 * Root-relative link to an in-tree page.
 * Utility links are only ever emitted from the docs root index, so the href is always root-relative (`./<segments>.<ext>`).
 */
function rootRelativeLink(pathSegments: readonly string[]): string {
    return `./${pathSegments.join('/')}.${DOC_EXT}`;
}

function utilityLinksSection(deps: InjectDeps, markup: MarkupRenderer): string | undefined {
    if (!deps.utilityPages.length) return undefined;
    const items = deps.utilityPages.map(p => `- ${markup.link(p.title, rootRelativeLink(p.pathSegments))}`);
    return `${markup.heading(2, 'Utilities')}${BLOCK_SEPARATOR}${items.join('\n')}`;
}

/**
 * Fail fast if any overlay map references a node kind the spec does not declare.
 * These maps are hand-authored or extracted and keyed by node kind.
 * So a renamed / removed kind upstream would otherwise silently drop its diagram / functions.
 */
export function validateInjectKeys(spec: Spec, deps: Pick<InjectDeps, 'diagrams' | 'functions'>): void {
    const validNodeKinds = new Set(spec.categories.flatMap(c => c.nodes).map(n => n.kind));
    const check = (map: Readonly<Record<string, unknown>>, mapName: string): void => {
        for (const kind of Object.keys(map)) {
            if (!validNodeKinds.has(kind)) {
                throw new Error(`${mapName} references "${kind}" which is not a node kind in the spec.`);
            }
        }
    };
    check(deps.diagrams, 'diagrams');
    check(deps.functions, 'functions');
}
