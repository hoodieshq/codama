/**
 * Architecture check: spec-authored examples + package-specific examples must
 * render together in ONE `## Examples` section.
 *
 * All 94 spec nodes currently ship `examples: []`, so we simulate Agent A's
 * future A5 by authoring a spec example on one node (via the real `example()`
 * factory), then run the actual codama merge + generate and assert the page's
 * `## Examples` contains both the spec example and the package-local one.
 */

import assert from 'node:assert/strict';
import process from 'node:process';

import { example } from '@codama/spec/api';
import type { Spec } from '@codama/spec/api';
import { generate, pascal } from '@codama/spec/docs';
import { getSpec } from '@codama/spec/v1';

import { docsOptions, mergeLocalExamples } from './merge';

const TARGET = 'amountTypeNode';
const SPEC_TITLE = 'From the spec (4 decimals)';
const LOCAL_TITLE = '2-decimals USD amount';

/** Simulate A5: the spec itself authors an example on the node. */
function withSpecExample(spec: Spec): Spec {
    return {
        ...spec,
        categories: spec.categories.map(c => ({
            ...c,
            nodes: c.nodes.map(n =>
                n.kind === TARGET
                    ? {
                          ...n,
                          examples: [
                              ...n.examples,
                              example({ code: "amountTypeNode(numberTypeNode('u64'), 4)", title: SPEC_TITLE }),
                          ],
                      }
                    : n,
            ),
        })),
    };
}

const files = generate(mergeLocalExamples(withSpecExample(getSpec())), docsOptions);

const page = files.find(f => f.path.endsWith(`/${pascal(TARGET)}.mdx`));
assert(page, `no page generated for ${TARGET}`);

const examplesStart = page.content.indexOf('## Examples');
assert(examplesStart !== -1, 'no `## Examples` section rendered');
const functionsStart = page.content.indexOf('## Functions');
const examples = page.content.slice(examplesStart, functionsStart === -1 ? undefined : functionsStart).trim();

const specAt = examples.indexOf(SPEC_TITLE);
const localAt = examples.indexOf(LOCAL_TITLE);
assert(specAt !== -1, 'spec-authored example missing from `## Examples`');
assert(localAt !== -1, 'package-local example missing from `## Examples`');
assert(specAt < localAt, 'expected the spec example before the package-local example');

process.stdout.write('--- rendered `## Examples` for AmountTypeNode ---\n\n');
process.stdout.write(examples + '\n\n');
process.stdout.write('PASS: spec-authored + package-local examples both render in one `## Examples` section.\n');
