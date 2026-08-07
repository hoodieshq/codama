import { defineConfig } from 'tsup';

/**
 * `@codama-internal/spec-generators` is a private build-time tool, never
 * published to npm and never imported by other workspace packages at
 * runtime. We only need a single Node ESM build that the `generate`
 * script can invoke directly.
 *
 * Two entries are emitted: the orchestrator surface (`src/index.ts`) and
 * the bin script (`bin/generate.ts`). Both inline their dependencies
 * (`splitting: false`) so each entry stands on its own and the dist
 * layout remains predictable from the script that runs it.
 */
export default defineConfig({
    clean: false,
    dts: false,
    entry: {
        generate: './bin/generate.ts',
        index: './src/index.ts',
    },
    // `typescript` relies on dynamic `require`, which esbuild cannot express in an ESM bundle. TypeDoc
    // resolves its plugins by module name at runtime, so it must stay resolvable from node_modules too.
    // Keep all three external so they load at runtime instead of being inlined.
    external: ['typedoc', 'typedoc-plugin-markdown', 'typescript'],
    format: 'esm',
    outExtension() {
        return { js: '.mjs' };
    },
    platform: 'node',
    sourcemap: true,
    splitting: false,
    target: 'node20',
    treeshake: true,
});
