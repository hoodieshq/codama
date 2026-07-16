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

import { DOC_EXT } from './constants';
import { type ExtractedDocs, extractTsdocDocs } from './extractTsdoc';
import { buildContentInjection, diagrams, validateInjectKeys } from './inject';
import { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

export { buildContentInjection, validateInjectKeys } from './inject';
export { extractTsdocDocs } from './extractTsdoc';
export { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

/**
 * Pure, sync render-map entry point: assembles the map from the spec and the extracted doc overlays.
 * `extracted` is additional injected content.
 */
export function getRenderMap(spec: Spec, options: RenderOptions, extracted: ExtractedDocs): RenderMap<BaseFragment> {
    validateRenderOptions(spec, options);
    // Functions blocks and utility pages are derived from source TSDoc.
    // diagrams stay hand-written.
    const { functions, utilityPages } = extracted;
    const injectDeps = { diagrams, functions, utilityPages };
    validateInjectKeys(spec, injectDeps);

    const docModel = generateSpecDocs(spec, {
        inject: buildContentInjection(injectDeps),
        linkStrategy: relativeLinks(DOC_EXT),
        pathConfig: LocalDocsPathConfig,
    });

    const entries: Record<Path, BaseFragment> = {};
    for (const page of docModel.pages) {
        // `DocPage.content` has no trailing newline, so append one so files end cleanly.
        entries[`${page.pathSegments.join('/')}.${DOC_EXT}`] = { content: `${page.content}\n` };
    }

    // Standalone utility pages live outside the spec model.
    // Add them under `utilities/` directory.
    for (const utilityPage of utilityPages) {
        entries[`${utilityPage.pathSegments.join('/')}.${DOC_EXT}`] = { content: `${utilityPage.content}\n` };
    }
    return createRenderMap(entries);
}

/**
 * Generate the node docs and write them to `options.outputDir`.
 * Build the map before touching disk so a validation failure throws before `deleteDirectory` wipes existing docs.
 */
export function generateNodeDocs(spec: Spec, options: GenerateOptions): void {
    const extractedTsDocs = extractTsdocDocs();
    const renderMap = getRenderMap(spec, options, extractedTsDocs);
    deleteDirectory(options.outputDir);
    writeRenderMap(renderMap, options.outputDir);
}
