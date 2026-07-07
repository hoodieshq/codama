import {
    type BaseFragment,
    createRenderMap,
    deleteDirectory,
    type Path,
    type RenderMap,
    writeRenderMap,
} from '@codama/fragments';
import type { Spec } from '@codama/spec';
import { generateDocs as generateSpecDocs, LocalDocsPathConfig, relativeLinks } from '@codama/spec/docs';

import { buildInject, defaultInjectDeps, validateInjectKeys } from './inject';
import { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

export { buildInject, validateInjectKeys } from './inject';
export { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

/** Pure, sync render-map entry point. Tests call this directly without touching the filesystem. */
export function getRenderMap(spec: Spec, options: RenderOptions): RenderMap<BaseFragment> {
    validateRenderOptions(spec, options);
    validateInjectKeys(spec, defaultInjectDeps);
    const model = generateSpecDocs(spec, {
        inject: buildInject(defaultInjectDeps),
        linkStrategy: relativeLinks('md'),
        pathConfig: LocalDocsPathConfig,
    });
    const entries: Record<Path, BaseFragment> = {};
    for (const page of model.pages) {
        // `DocPage.content` has no trailing newline; add one so files end cleanly.
        entries[`${page.pathSegments.join('/')}.md`] = { content: `${page.content}\n` };
    }
    return createRenderMap(entries);
}

/** Build the render map and write it under `options.outputDir`, wiping the dir first. */
export function generateNodesDocs(spec: Spec, options: GenerateOptions): void {
    deleteDirectory(options.outputDir);
    writeRenderMap(getRenderMap(spec, options), options.outputDir);
}
