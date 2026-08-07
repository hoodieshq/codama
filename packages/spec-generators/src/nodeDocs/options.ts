import type { Path } from '@codama/fragments';
import type { Spec } from '@codama/spec';

import { type SharedRenderOptions, validateSharedRenderOptions } from '../shared';
import { DOCS_CATEGORY_DIRECTORIES } from './constants';

export type RenderOptions = Pick<SharedRenderOptions, 'categoryDirectories' | 'targetSpecMajor'>;

export interface GenerateOptions extends RenderOptions {
    readonly outputDir: Path;
}

/** The caller's category directories, or the docs defaults when the caller supplied none. */
export function resolveCategoryDirectories(options: RenderOptions): ReadonlyMap<string, string> {
    return options.categoryDirectories ?? DOCS_CATEGORY_DIRECTORIES;
}

/**
 * Cross-check the options against the spec before any page is built. The resolved map is handed to the shared
 * validator so a category added to the spec fails the run even when the caller relies on the defaults.
 */
export function validateRenderOptions(spec: Spec, options: RenderOptions): void {
    validateSharedRenderOptions(spec, { ...options, categoryDirectories: resolveCategoryDirectories(options) });
}
