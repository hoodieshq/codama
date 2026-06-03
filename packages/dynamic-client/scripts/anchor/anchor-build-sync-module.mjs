import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const PROGRAMS = ['example', 'blog'];

/**
 * Copies the freshly built `.so` files into the committed `dumps/` directory.
 * Writes the source-hash file.
 *
 * @param {string} [packageRoot] Defaults to `process.cwd()` (the package root when invoked via a pnpm script).
 * @returns {{ hashes: Record<string, string>, artifactPath: string }}
 * @throws {Error} if a built `.so` is missing (the Anchor build has not run).
 */
export function syncAnchorBuilds(packageRoot = process.cwd()) {
    const anchorPath = path.join(packageRoot, 'test', 'programs', 'anchor');
    const binariesPath = path.join(anchorPath, 'target', 'deploy');
    const dumpsPath = path.join(packageRoot, 'test', 'programs', 'dumps');
    const artifactsPath = path.join(anchorPath, 'artifacts');
    const outArtifactPath = path.join(artifactsPath, 'anchor-build-sync-hashes.json');

    const missing = PROGRAMS.map(program => path.join(binariesPath, `${program}.so`)).filter(
        soPath => !existsSync(soPath),
    );
    if (missing.length > 0) {
        throw new Error(
            `Missing build artifact(s):\n  ${missing.join('\n  ')}\n` + 'Run `pnpm anchor:build` before syncing.',
        );
    }

    mkdirSync(dumpsPath, { recursive: true });
    mkdirSync(artifactsPath, { recursive: true });

    const hashes = {};
    for (const program of PROGRAMS) {
        copyFileSync(path.join(binariesPath, `${program}.so`), path.join(dumpsPath, `${program}.so`));
        hashes[program] = hashProgramSource(path.join(anchorPath, 'programs', program));
    }

    // Sort program names for consistency.
    const sorted = Object.fromEntries(
        Object.keys(hashes)
            .sort()
            .map(key => [key, hashes[key]]),
    );
    writeFileSync(outArtifactPath, JSON.stringify(sorted, null, 4) + '\n');
    return { hashes: sorted, artifactPath: outArtifactPath };
}

/**
 * Deterministic SHA-256 of a program's build-affecting source inputs.
 *
 * Inputs: `programs/<name>/src/**\/*.rs`, `programs/<name>/Cargo.toml`, the
 * shared `anchor/Anchor.toml`, and the shared `anchor/Cargo.lock`.
 *
 * Determinism: file contents are line-ending normalized (CRLF -> LF) and the
 * resulting blobs are sorted before hashing, so the digest depends only on the
 * multiset of file contents — not on filesystem read order, paths, or OS line
 * endings.
 *
 * @param {string} programDir Absolute path to `programs/<name>`.
 * @returns {string} lowercase hex SHA-256.
 * @throws {Error} if the source directory or any required input is missing.
 */
export function hashProgramSource(programDir) {
    const srcPath = path.join(programDir, 'src');
    if (!existsSync(srcPath) || !statSync(srcPath).isDirectory()) {
        throw new Error(`[hashProgramSource] source directory not found: ${srcPath}`);
    }

    const anchorRoot = path.resolve(programDir, '..', '..'); // .../test/programs/anchor
    const srcFiles = readdirSync(srcPath, { recursive: true })
        .map(entry => path.join(srcPath, entry.toString()))
        .filter(file => file.endsWith('.rs'));

    const inputs = [
        ...srcFiles,
        path.join(programDir, 'Cargo.toml'),
        path.join(anchorRoot, 'Anchor.toml'),
        path.join(anchorRoot, 'Cargo.lock'),
    ];
    for (const file of inputs) {
        if (!existsSync(file)) {
            throw new Error(`[hashProgramSource] required input is missing: ${file}`);
        }
    }

    const contents = inputs.map(file => readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).sort();

    const hash = createHash('sha256');
    for (const content of contents) {
        hash.update(content);
        hash.update('\0');
    }
    return hash.digest('hex');
}
