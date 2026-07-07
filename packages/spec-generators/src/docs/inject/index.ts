/**
 * Per-node documentation overlays for the spec-generated pages.
 * The spec docs generator owns each page title, description and Attributes table.
 * TS-specific content lives here instead: diagrams, the Functions section and Examples.
 * `buildInject` returns the inject hook that places them into the page slots.
 * Diagrams go to the `afterDescription` slot, Functions then Examples to `end`.
 * `validateInjectKeys` fails the run when an overlay is keyed by an unknown node kind.
 * The overlay content lives in the sibling `local*` modules, keyed by node kind.
 */

import type { Spec } from '@codama/spec';
import type { InjectContent } from '@codama/spec/docs';

import { localDiagrams } from './localDiagrams';
import { type ExampleSpec, localExamples } from './localExamples';
import { localFunctions } from './localFunctions';

export { localDiagrams } from './localDiagrams';
export { type ExampleSpec, localExamples } from './localExamples';
export { localFunctions } from './localFunctions';

interface InjectDeps {
    readonly localDiagrams: Record<string, string>;
    readonly localExamples: Record<string, readonly ExampleSpec[]>;
    readonly localFunctions: Record<string, string>;
}

/**
 * Diagrams at the `afterDescription` slot;
 * Functions and Examples at the `end` slot.
 * */
export function buildInject(deps: InjectDeps): InjectContent {
    return ({ markup, page, slot }) => {
        if (page.kind !== 'node') return undefined;
        const kind = page.node.kind;

        if (slot === 'afterDescription') {
            return deps.localDiagrams[kind];
        }

        if (slot === 'end') {
            const blocks: string[] = [];

            const functions = deps.localFunctions[kind];
            if (functions) blocks.push(functions);

            const examples = deps.localExamples[kind];
            if (examples?.length) {
                const parts = [
                    markup.heading(2, 'Examples'),
                    ...examples.map(ex => `${markup.heading(3, ex.title)}\n\n${markup.codeBlock('ts', ex.code)}`),
                ];
                blocks.push(parts.join('\n\n'));
            }

            return blocks.length ? blocks.join('\n\n') : undefined;
        }

        return undefined;
    };
}

/**
 * Fail fast if any overlay map references a node kind the spec does not declare.
 * These maps are hand-authored and keyed by node kind.
 * So a renamed / removed kind upstream would otherwise silently drop its diagram / functions / examples.
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
    check(deps.localDiagrams, 'localDiagrams');
    check(deps.localExamples, 'localExamples');
    check(deps.localFunctions, 'localFunctions');
}

/** The default overlay content bundled with this generator, keyed by node kind. */
export const defaultInjectDeps: InjectDeps = { localDiagrams, localExamples, localFunctions };
