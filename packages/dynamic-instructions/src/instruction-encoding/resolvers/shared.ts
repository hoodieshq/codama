import type { Address } from '@solana/addresses';
import type {
    InstructionAccountNode,
    InstructionNode,
    LinkableDictionary,
    NodeStack,
    ProgramNode,
    RootNode,
} from 'codama';
import { instructionAccountLinkNode, isNode } from 'codama';

import type { AddressInput } from '../../shared/address';
import { AccountError } from '../../shared/errors';
import type { AccountsInput, ArgumentsInput, ResolversInput } from '../../shared/types';

/**
 * Static environment created once per instruction resolution.
 * The stack path is always [RootNode, ProgramNode, InstructionNode].
 */
type InstructionResolutionEnvironment = {
    linkables: LinkableDictionary;
    stack: NodeStack;
};

/**
 * Runtime state per .instruction() invocation.
 */
type RuntimeResolutionState = {
    accountsInput: AccountsInput | undefined;
    argumentsInput: ArgumentsInput | undefined;
    resolvedAddresses: ResolvedAddresses;
    resolversInput: ResolversInput | undefined;
};

/**
 * Combined context threaded through the resolution pipeline.
 * Individual resolvers/visitors extend this with domain-specific fields.
 */
export type ResolutionContext = InstructionResolutionEnvironment & RuntimeResolutionState;

/**
 * Per-account extension of ResolutionContext.
 */
export type AccountResolutionContext = ResolutionContext & {
    accountAddressInput?: AddressInput | null | undefined;
    ixAccountNode: InstructionAccountNode;
};

export type ResolvedAddresses = Map<string, Address | null>;

// --- Stack extraction helpers ---
// Stack path is [Root, Program, Instruction]. Validated at runtime.

export function getRootFromCtx(ctx: ResolutionContext): RootNode {
    const path = ctx.stack.getPath();
    const node = path[0];
    if (!node || !isNode(node, 'rootNode')) {
        throw new AccountError('Expected RootNode at stack path[0]');
    }
    return node;
}

export function getProgramFromCtx(ctx: ResolutionContext): ProgramNode {
    const path = ctx.stack.getPath();
    const node = path[1];
    if (!node || !isNode(node, 'programNode')) {
        throw new AccountError('Expected ProgramNode at stack path[1]');
    }
    return node;
}

export function getInstructionFromCtx(ctx: ResolutionContext): InstructionNode {
    const path = ctx.stack.getPath();
    const node = path[2];
    if (!node || !isNode(node, 'instructionNode')) {
        throw new AccountError('Expected InstructionNode at stack path[2]');
    }
    return node;
}

/**
 * Looks up an instruction account via linkables.
 * Uses `get()` (not `getOrThrow()`) — callers decide error semantics.
 */
export function getInstructionAccountFromCtx(ctx: ResolutionContext, name: string): InstructionAccountNode | undefined {
    return ctx.linkables.get([...ctx.stack.getPath(), instructionAccountLinkNode(name)]);
}
