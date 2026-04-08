import type { Address } from '@solana/addresses';
import type { InstructionAccountNode, InstructionNode, RootNode } from 'codama';
import { getResolvedInstructionInputsVisitor, isNode, visit, visitOrElse } from 'codama';

import { type AddressInput, isConvertibleAddress, toAddress } from '../../shared/address';
import { AccountError, DependencyNotResolvedError } from '../../shared/errors';
import type { AccountsInput, ArgumentsInput, ResolversInput } from '../../shared/types';
import { createAccountDefaultValueVisitor } from '../visitors/account-default-value';
import type { BaseResolutionContext } from './types';

type ResolveAccountAddressContext = BaseResolutionContext & {
    accountAddressInput?: AddressInput | null | undefined;
    ixAccountNode: InstructionAccountNode;
};

type PendingAccount = {
    blockedBy: string[];
    node: InstructionAccountNode;
};

/**
 * Resolves the address of an instruction account node via either defaultValue or optionalAccountStrategy.
 */
export async function resolveAccountAddress({
    root,
    ixNode,
    ixAccountNode,
    argumentsInput,
    accountsInput,
    resolvedAddresses,
    resolversInput,
    accountAddressInput,
}: ResolveAccountAddressContext): Promise<Address | null> {
    // Optional accounts explicitly provided as null should be resolved based on optionalAccountStrategy
    if (accountAddressInput === null && ixAccountNode.isOptional) {
        return resolveOptionalAccountWithStrategy(root, ixNode, ixAccountNode);
    }

    if (ixAccountNode.defaultValue) {
        const visitor = createAccountDefaultValueVisitor({
            accountAddressInput,
            accountsInput,
            argumentsInput,
            ixAccountNode,
            ixNode,
            resolvedAddresses,
            resolversInput,
            root,
        });

        const addressValue = await visitOrElse(ixAccountNode.defaultValue, visitor, node => {
            throw new AccountError(
                `Cannot resolve account ${ixAccountNode.name}:${node.kind} of ${ixNode.name} instruction`,
            );
        });

        // conditionalValueNode with ifFalse branch returns null.
        // This should be resolved via optionalAccountStrategy for optional accounts.
        if (addressValue === null && ixAccountNode.isOptional) {
            return resolveOptionalAccountWithStrategy(root, ixNode, ixAccountNode);
        }

        return addressValue;
    }

    throw new AccountError(
        `Cannot resolve account ${ixAccountNode.name} of ${ixNode.name} instruction. Account doesn't have default value or was not provided`,
    );
}

/**
 * Optional account resolution via instruction strategy.
 * With "programId" strategy, optional accounts are resolved to programId.
 * With "omitted" strategy, optional accounts must be excluded from accounts list.
 */
function resolveOptionalAccountWithStrategy(
    root: RootNode,
    ixNode: InstructionNode,
    ixAccountNode: InstructionAccountNode,
) {
    if (!ixAccountNode.isOptional) {
        throw new AccountError(
            `Account ${ixAccountNode.name} of ${ixNode.name} instruction is not optional, cannot apply optional account strategy`,
        );
    }
    switch (ixNode.optionalAccountStrategy) {
        case 'omitted':
            return null;
        case 'programId':
            return toAddress(root.program.publicKey);
        default:
            throw new AccountError(
                `Cannot resolve optional account: ${ixAccountNode.name} of ${ixNode.name} instruction with strategy: ${String(ixNode.optionalAccountStrategy)}`,
            );
    }
}

/**
 * Primary path: resolve accounts sequentially in topological order.
 */
export async function resolveAccountAddressesByOrder(
    root: RootNode,
    ixNode: InstructionNode,
    argumentsInput: ArgumentsInput,
    accountsInput: AccountsInput,
    resolversInput: ResolversInput,
): Promise<Map<string, Address | null>> {
    const sortedInputs = visit(ixNode, getResolvedInstructionInputsVisitor());
    const resolvedAddresses = new Map<string, Address | null>();

    for (const ixAccountNode of sortedInputs) {
        if (!isNode(ixAccountNode, 'instructionAccountNode')) {
            continue; // Skip non-account inputs.
        }
        const accountAddressInput = accountsInput?.[ixAccountNode.name];
        const isAccountProvided = accountAddressInput !== undefined && accountAddressInput !== null;
        // Accounts with default values can be omitted, as they can be resolved from default value.
        if (!isAccountProvided && !ixAccountNode.isOptional && !ixAccountNode.defaultValue) {
            throw new AccountError(`Missing required account: ${ixAccountNode.name}`);
        }

        let addr: Address | null = null;
        if (isAccountProvided) {
            addr = toAddress(accountAddressInput);
        } else {
            addr = await resolveAccountAddress({
                accountAddressInput,
                accountsInput,
                argumentsInput,
                ixAccountNode,
                ixNode,
                resolvedAddresses,
                resolversInput,
                root,
            });
        }

        resolvedAddresses.set(ixAccountNode.name, addr);
    }

    return resolvedAddresses;
}

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
export async function resolveAccountAddressesFallback(
    root: RootNode,
    ixNode: InstructionNode,
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
                    resolvedAddresses,
                    resolversInput,
                    root,
                });
                resolvedAddresses.set(ixAccountNode.name, addr);
                hasResolvedAddresses = true;
            } catch (error) {
                if (error instanceof DependencyNotResolvedError) {
                    // Dependency not yet resolved — retry in next pass.
                    entry.blockedBy = [...new Set<string>([...entry.blockedBy, error.dependencyName])];
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
