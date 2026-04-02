import type { Address } from '@solana/addresses';
import type { InstructionAccountNode, InstructionNode, LinkableDictionary, RootNode } from 'codama';

import { isConvertibleAddress, toAddress } from '../../shared/address';
import { AccountError, DependencyNotResolvedError } from '../../shared/errors';
import type { AccountsInput, ArgumentsInput, ResolversInput } from '../../shared/types';
import { resolveAccountAddress } from '../resolvers/resolve-account-address';

type PendingAccount = {
    blockedBy: string[];
    node: InstructionAccountNode;
};

/**
 * Resolves all instruction account addresses.
 * It's a fallback for getResolvedInstructionInputsVisitor when its resolution fails (circular deps, nested argument dependencies (like in mpl-token-program), etc.).
 * 1) Resolves user-provided accounts and accounts with no dependencies (publicKeyValueNode, payerValueNode, etc.).
 * 2) Resolves accounts whose dependencies were resolved in prior passes.
 * Continues until all accounts are resolved or resolution can not be made.
 *
 * This approach handles:
 * - Forward dependencies (account B listed before account A it depends on)
 * - Circular dependencies broken by user-provided accounts
 * - Nested argument dependencies in resolverValueNode.dependsOn (no static analysis needed)
 */
export async function resolveAccountsFallback(
    root: RootNode,
    ixNode: InstructionNode,
    linkables: LinkableDictionary,
    argumentsInput: ArgumentsInput = {},
    accountsInput: AccountsInput = {},
    resolversInput: ResolversInput = {},
): Promise<Map<string, Address | null>> {
    const resolvedAddresses = new Map<string, Address | null>();

    // Pre-resolve user-provided accounts.
    for (const ixAccountNode of ixNode.accounts) {
        const accountAddressInput = accountsInput?.[ixAccountNode.name];
        if (isProvidedAccount(accountAddressInput)) {
            resolvedAddresses.set(ixAccountNode.name, toAddress(accountAddressInput));
        }
    }

    // Collect accounts that need resolution.
    let pending: PendingAccount[] = ixNode.accounts
        .filter(acc => !resolvedAddresses.has(acc.name))
        .map(node => ({ blockedBy: [], node }));

    while (pending.length > 0) {
        let hasResolvedAddresses = false;
        const stillPending: PendingAccount[] = [];

        for (const entry of pending) {
            const { node: ixAccountNode } = entry;

            // Required accounts without defaults that cannot be resolved.
            if (!ixAccountNode.isOptional && !ixAccountNode.defaultValue) {
                throw new AccountError(`Missing required account: ${ixAccountNode.name}`);
            }

            try {
                const addr = await resolveAccountAddress({
                    accountAddressInput: accountsInput?.[ixAccountNode.name],
                    accountsInput,
                    argumentsInput,
                    ixAccountNode,
                    ixNode,
                    linkables,
                    resolvedAddresses,
                    resolversInput,
                    root,
                });
                resolvedAddresses.set(ixAccountNode.name, addr);
                hasResolvedAddresses = true;
            } catch (error) {
                if (error instanceof DependencyNotResolvedError) {
                    // Dependency not yet resolved — retry in next pass.
                    entry.blockedBy = [...new Set([...entry.blockedBy, error.dependencyName])];
                    stillPending.push(entry);
                } else {
                    throw error;
                }
            }
        }

        // If no addresses were resolved in this pass, we have a deadlock (circular dependency or missing user input).
        if (!hasResolvedAddresses) {
            const graph = stillPending.map(e => `${e.node.name} (blocked by: ${e.blockedBy.join(', ')})`).join('; ');
            throw new AccountError(`Cannot resolve accounts: ${graph}`);
        }

        pending = stillPending;
    }

    return resolvedAddresses;
}

function isProvidedAccount(input: unknown): input is NonNullable<unknown> {
    return input !== undefined && input !== null && isConvertibleAddress(input);
}
