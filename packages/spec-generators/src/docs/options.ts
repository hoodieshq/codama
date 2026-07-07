import type { Path } from '@codama/fragments';
import type { Spec } from '@codama/spec';

import { validateSharedRenderOptions } from '../shared';

export interface RenderOptions {
    /** The spec major version this invocation targets. */
    readonly targetSpecMajor: number;
}

export interface GenerateOptions extends RenderOptions {
    readonly outputDir: Path;
}

export function validateRenderOptions(spec: Spec, options: RenderOptions): void {
    validateSharedRenderOptions(spec, options);
}
