import type { Path } from '@codama/fragments';
import type { Spec } from '@codama/spec';

import { SharedRenderOptions, validateSharedRenderOptions } from '../shared';

export type RenderOptions = Pick<SharedRenderOptions, 'targetSpecMajor'>;

export interface GenerateOptions extends RenderOptions {
    readonly outputDir: Path;
}

export function validateRenderOptions(spec: Spec, options: RenderOptions): void {
    validateSharedRenderOptions(spec, options);
}
