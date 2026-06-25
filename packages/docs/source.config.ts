import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

// `content/docs` is generated in place by `src/buildContent.ts` (spec → MDX,
// with codama-local examples merged in). It lives under this `"type": "module"`
// package, so fumadocs-mdx's ESM `.mdx.js` companions resolve correctly.
export const docs = defineDocs({
    dir: 'content/docs',
});

export default defineConfig();
