import {
    type BaseFragment,
    createRenderMap,
    deleteDirectory,
    type Path,
    type RenderMap,
    writeRenderMap,
} from '@codama/fragments';
import type { Spec } from '@codama/spec';

import { DOC_EXT } from './constants';
import { type ExtractedDocs, extractTsdocDocs } from './extractTsdoc';
import { type GenerateOptions, type RenderOptions, resolveCategoryDirectories, validateRenderOptions } from './options';
import { buildPageInventory } from './pages';
import { renderCategoryIndex, renderEntityPage, renderRootIndex } from './render';

export { extractTsdocDocs } from './extractTsdoc';
export { type GenerateOptions, type RenderOptions, validateRenderOptions } from './options';

/** Docs-root-relative file path for a page's extension-less segments. */
function docPath(pathSegments: readonly string[]): Path {
    return `${pathSegments.join('/')}.${DOC_EXT}`;
}

/**
 * Fail when the extractor produced a `## Functions` block for a node kind the spec does not declare. Without
 * this, renaming a node kind in the spec would silently drop its helper docs instead of failing the run.
 */
function validateFunctionKeys(spec: Spec, functions: Record<string, string>): void {
    const kinds = new Set(spec.categories.flatMap(category => category.nodes.map(node => node.kind)));
    const unknown = Object.keys(functions).filter(kind => !kinds.has(kind));
    if (unknown.length > 0) {
        throw new Error(
            `extracted TSDoc has "## Functions" blocks for unknown node kind(s) ${JSON.stringify(unknown)}. ` +
                'Update ENTRY_MODULES in extractTsdoc.ts.',
        );
    }
}

/** Pure, sync render-map entry point: assembles every page from the spec inventory and the extracted TSDoc. */
export function getRenderMap(spec: Spec, options: RenderOptions, extracted: ExtractedDocs): RenderMap<BaseFragment> {
    validateRenderOptions(spec, options);
    validateFunctionKeys(spec, extracted.functions);

    const inventory = buildPageInventory(spec, resolveCategoryDirectories(options));
    const entries: Record<Path, BaseFragment> = {};

    for (const category of inventory) {
        for (const entity of category.entities) {
            entries[docPath(entity.pathSegments)] = {
                content: `${renderEntityPage(entity, extracted.functions[entity.name])}\n`,
            };
        }
        // The top-level category has no index of its own: its entities are listed on the root index.
        if (category.directory !== '') {
            entries[docPath([category.directory, 'README'])] = { content: `${renderCategoryIndex(category)}\n` };
        }
    }

    entries[docPath(['README'])] = {
        content: `${renderRootIndex(inventory, spec.version, extracted.utilityPages)}\n`,
    };

    // Utility pages come from source TSDoc alone and have no spec counterpart.
    for (const utilityPage of extracted.utilityPages) {
        entries[docPath(utilityPage.pathSegments)] = { content: `${utilityPage.content}\n` };
    }

    return createRenderMap(entries);
}

/**
 * Generate the node docs and write them to `options.outputDir`.
 * Build the map before touching disk so a validation failure throws before `deleteDirectory` wipes existing docs.
 */
export function generateNodeDocs(spec: Spec, options: GenerateOptions): void {
    const renderMap = getRenderMap(spec, options, extractTsdocDocs());
    deleteDirectory(options.outputDir);
    writeRenderMap(renderMap, options.outputDir);
}
