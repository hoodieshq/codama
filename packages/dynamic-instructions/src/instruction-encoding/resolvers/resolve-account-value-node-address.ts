import type { Address } from '@solana/addresses';
import type { AccountValueNode } from 'codama';

import { toAddress } from '../../shared/address';
import { AccountError } from '../../shared/errors';
import { resolveAccountAddress } from './resolve-account-address';
import { getInstructionAccountFromCtx, getInstructionFromCtx, type ResolutionContext, ResolutionPath } from './shared';

/**
 * Resolves an AccountValueNode reference to an Address.
 *
 * Shared logic for resolving account references across visitors:
 * Checks if the user provided the account address in accountsInput.
 * Finds the referenced InstructionAccountNode via linkables.
 * Delegates to resolveAccountAddress for default value resolution.
 */
export async function resolveAccountValueNodeAddress(
    node: AccountValueNode,
    ctx: ResolutionContext,
): Promise<Address | null> {
    const { accountsInput } = ctx;
    const ixNode = getInstructionFromCtx(ctx);

    // Check if user provided the account address.
    const providedAddress = accountsInput?.[node.name];
    if (providedAddress !== undefined && providedAddress !== null) {
        return toAddress(providedAddress);
    }

    // Find the referenced account in the instruction via linkables.
    const referencedIxAccountNode = getInstructionAccountFromCtx(ctx, node.name);
    if (!referencedIxAccountNode) {
        throw new AccountError(`Referenced account "${node.name}" not found in instruction "${ixNode.name}"`);
    }

    // Detect circular dependencies before recursing.
    detectCircularDependency(node.name, ctx.resolutionPath);

    return await resolveAccountAddress({
        ...ctx,
        accountAddressInput: providedAddress,
        ixAccountNode: referencedIxAccountNode,
        resolutionPath: [...ctx.resolutionPath, node.name],
    });
}

export function detectCircularDependency(nodeName: string, resolutionPath: ResolutionPath) {
    if (resolutionPath.includes(nodeName)) {
        throw new AccountError(`Circular dependency detected: ${[...resolutionPath, nodeName].join(' -> ')}`);
    }
}
