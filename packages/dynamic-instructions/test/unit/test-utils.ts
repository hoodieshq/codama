import { Address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';
import { getRecordLinkablesVisitor, LinkableDictionary, NodeStack, visit } from 'codama';

import type { ResolutionContext } from '../../src/instruction-encoding/resolvers/shared';

export function buildLinkables(root: RootNode): LinkableDictionary {
    const linkables = new LinkableDictionary();
    visit(root, getRecordLinkablesVisitor(linkables));
    return linkables;
}

export function buildStack(root: RootNode, ixNode: InstructionNode): NodeStack {
    const stack = new NodeStack([root, root.program, ixNode]);
    return stack;
}

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
        stack: buildStack(root, ixNode),
    };
}
