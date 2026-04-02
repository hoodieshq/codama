import type { Address } from '@solana/addresses';
import type { AccountValueNode } from 'codama';

import { toAddress } from '../../shared/address';
import { AccountError, DependencyNotResolvedError } from '../../shared/errors';
import { getInstructionAccountFromCtx, getInstructionFromCtx, type ResolutionContext } from './shared';

/**
 * Resolves an AccountValueNode reference to an Address.
 *
 * Looks up the referenced account in accountsInput (user-provided).
 * Or in the resolvedAddresses map (populated by prior resolution).
 * Throws DependencyNotResolvedError if the dependency exists but hasn't been resolved yet
 * To allow for custom resolutiion retry.
 */
export function resolveAccountValueNodeAddress(node: AccountValueNode, ctx: ResolutionContext): Address | null {
    const { accountsInput, resolvedAddresses } = ctx;
    const ixNode = getInstructionFromCtx(ctx);

    // Check if user provided the account address.
    const providedAddress = accountsInput?.[node.name];
    if (providedAddress !== undefined && providedAddress !== null) {
        return toAddress(providedAddress);
    }

    // Look up from already-resolved addresses.
    const resolved = resolvedAddresses.get(node.name);
    if (resolved !== undefined) {
        return resolved;
    }

    // Check if the account exists in the instruction via linkables.
    const referencedIxAccountNode = getInstructionAccountFromCtx(ctx, node.name);
    if (!referencedIxAccountNode) {
        throw new AccountError(`Referenced account "${node.name}" not found in instruction "${ixNode.name}"`);
    }

    // Account exists but hasn't been resolved yet — signal to multi-pass loop to retry.
    throw new DependencyNotResolvedError(node.name, ixNode.name);
}
