/**
 * The codama docs composition layer: how spec data is extended with
 * package-specific (TypeScript) material before generation.
 *
 * `mergeLocalExamples` appends codama-local examples to each node's spec
 * `examples[]`, so spec-authored and package-specific examples render together
 * in a single `## Examples` section. `docsOptions` carries the `## Functions`
 * layer via the generator's `extendNode` seam.
 */

import type { CategorySpec, NodeSpec, Spec } from '@codama/spec/api';
import type { DocsOptions } from '@codama/spec/docs';

import { localExamples, localFunctions } from './localExamples';

/** Return a copy of the spec with codama-local examples merged into each node. */
export function mergeLocalExamples(spec: Spec): Spec {
    return {
        ...spec,
        categories: spec.categories.map(
            (category): CategorySpec => ({
                ...category,
                nodes: category.nodes.map((node): NodeSpec => {
                    const extra = localExamples[node.kind];
                    if (!extra || extra.length === 0) return node;
                    return { ...node, examples: [...node.examples, ...extra] };
                }),
            }),
        ),
    };
}

export const docsOptions: DocsOptions = {
    baseUrl: '/docs',
    // Append the TS helper-function reference — codama's language layer.
    extendNode: node => localFunctions[node.kind] ?? null,
};
