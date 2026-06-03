import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { hashProgramSource } from '../../../../scripts/anchor/anchor-build-sync-module.mjs';

const anchorDir = path.resolve(__dirname, '..');
const committedHashes = JSON.parse(
    readFileSync(path.join(anchorDir, 'artifacts', 'anchor-build-sync-hashes.json'), 'utf8'),
) as Record<string, string>;

describe('should keep anchor build dumps in sync with their source', () => {
    for (const program of ['example', 'blog'] as const) {
        test(`${program} source hash matches the committed snapshot`, () => {
            const actual = hashProgramSource(path.join(anchorDir, 'programs', program));
            expect(
                actual,
                `\`${program}\` source changed but \`dumps/${program}.so\` wasn't rebuilt — run \`pnpm anchor:sync:build\` and commit the refreshed artifacts.`,
            ).toBe(committedHashes[program]);
        });
    }
});
