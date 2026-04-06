import { Address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';

import {
    buildIxNodeStack,
    buildLinkables,
    type ResolutionContext,
} from '../../src/instruction-encoding/resolvers/shared';

/**
 * Builds a ResolutionContext for tests from root + ixNode + optional overrides.
 */
export function buildResolutionContext(
    root: RootNode,
    ixNode: InstructionNode,
    overrides?: Partial<
        Pick<ResolutionContext, 'accountsInput' | 'argumentsInput' | 'resolvedAddresses' | 'resolversInput'>
    >,
): ResolutionContext {
    return {
        accountsInput: overrides?.accountsInput ?? undefined,
        argumentsInput: overrides?.argumentsInput ?? undefined,
        linkables: buildLinkables(root),
        resolvedAddresses: overrides?.resolvedAddresses ?? new Map<string, Address | null>(),
        resolversInput: overrides?.resolversInput ?? undefined,
        stack: buildIxNodeStack(root, ixNode),
    };
}
