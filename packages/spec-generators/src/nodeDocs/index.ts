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

import { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

export { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

/** Pure, sync render-map entry point. Tests call this directly without touching the filesystem. */
export function getRenderMap(spec: Spec, options: RenderOptions): RenderMap<BaseFragment> {
    validateRenderOptions(spec, options);
    const model = generateSpecDocs(spec, {
        linkStrategy: relativeLinks('md'),
        pathConfig: LocalDocsPathConfig,
    });
    const entries: Record<Path, BaseFragment> = {};
    for (const page of model.pages) {
        // `DocPage.content` has no trailing newline, so append one so files end cleanly.
        entries[`${page.pathSegments.join('/')}.md`] = { content: `${page.content}\n` };
    }
    return createRenderMap(entries);
}

// Build the map before touching disk so a validation failure throws before `deleteDirectory` wipes existing docs.
export function generateNodeDocs(spec: Spec, options: GenerateOptions): void {
    const renderMap = getRenderMap(spec, options);
    deleteDirectory(options.outputDir);
    writeRenderMap(renderMap, options.outputDir);
}
