import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const PROGRAMS = ['example', 'blog'];

/**
 * Copies the freshly built `.so` files into the committed `dumps/` directory.
 *
 * @param {string} [packageRoot] Defaults to `process.cwd()` (the package root when invoked via a pnpm script).
 * @return {string} The path to the directory containing the synced `.so` files.
 * @throws {Error} if a built `.so` is missing (the Anchor build has not run).
 */
export function syncAnchorBuilds(packageRoot = process.cwd()) {
    const anchorPath = path.join(packageRoot, 'test', 'programs', 'anchor');
    const binariesPath = path.join(anchorPath, 'target', 'deploy');
    const dumpsPath = path.join(packageRoot, 'test', 'programs', 'dumps');

    const missing = PROGRAMS.map(program => path.join(binariesPath, `${program}.so`)).filter(
        soPath => !existsSync(soPath),
    );
    if (missing.length > 0) {
        throw new Error(
            `[anchor-build-sync] Missing build artifacts:\n  ${missing.join('\n  ')}\n` +
                'Run `pnpm anchor:build` before syncing.',
        );
    }

    for (const program of PROGRAMS) {
        copyFileSync(path.join(binariesPath, `${program}.so`), path.join(dumpsPath, `${program}.so`));
    }

    return dumpsPath;
}
