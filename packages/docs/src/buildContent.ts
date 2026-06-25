/**
 * Build the Fumadocs content tree from the Codama spec.
 *
 * Pipeline: `getSpec()` → merge local TS examples into each node's spec
 * `examples[]` (see `./merge`) → `generate()` (adds the `## Functions` layer via
 * `extendNode`) → write the resulting MDX + `meta.json` files under `content/docs/`.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { generate } from '@codama/spec/docs';
import { getSpec } from '@codama/spec/v1';

import { docsOptions, mergeLocalExamples } from './merge';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(HERE, '../content/docs');

async function main(): Promise<void> {
    const files = generate(mergeLocalExamples(getSpec()), docsOptions);

    await rm(CONTENT_DIR, { force: true, recursive: true });
    for (const file of files) {
        const dest = path.join(CONTENT_DIR, file.path);
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, file.content, 'utf8');
    }

    const pages = files.filter(f => f.path.endsWith('.mdx')).length;
    process.stdout.write(`wrote ${path.relative(process.cwd(), CONTENT_DIR)} (${pages} node pages)\n`);
}

await main();
