/**
 * Per-node documentation additions for the spec-generated pages.
 * The spec docs generator owns each page title, description, Attributes table and Examples section.
 * TS-specific content lives here: diagrams now, plus the Functions section filled by TSDoc.
 * `buildContentInjection` returns the inject hook that places them into the page slots.
 * Diagrams go to the `afterDescription` slot. Functions to the `afterAttributes` slot.
 * `validateInjectKeys` fails the run when an overlay is keyed by an unknown node kind.
 */

import type { Spec } from '@codama/spec';
import type { InjectContent } from '@codama/spec/docs';

import { diagrams } from './diagrams';

interface InjectDeps {
    readonly diagrams: Record<string, string>;
    readonly functions: Record<string, string>;
}

/**
 * Inject string content into the spec-generated pages.
 */
export function buildContentInjection(deps: InjectDeps): InjectContent {
    return ({ page, slot }) => {
        if (page.kind !== 'node') return undefined;
        const kind = page.node.kind;

        // Diagrams go after the description.
        if (slot === 'afterDescription') {
            return deps.diagrams[kind];
        }

        // Functions go after the Attributes table, before the spec's native Examples.
        if (slot === 'afterAttributes') {
            return deps.functions[kind];
        }

        return undefined;
    };
}

/**
 * Fail fast if any overlay map references a node kind the spec does not declare.
 * These maps are hand-authored and keyed by node kind.
 * So a renamed / removed kind upstream would otherwise silently drop its diagram / functions.
 */
export function validateInjectKeys(spec: Spec, deps: InjectDeps): void {
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

/** Default overlay content bundled with this generator. Functions stay empty until TSDoc extraction lands next PR. */
export const defaultInjectDeps: InjectDeps = { diagrams, functions: {} };
