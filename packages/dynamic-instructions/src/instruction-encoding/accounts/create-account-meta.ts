import type { Address } from '@solana/addresses';
import type { AccountMeta } from '@solana/instructions';
import { AccountRole } from '@solana/instructions';
import type { InstructionAccountNode, InstructionNode, ResolvedInstructionAccount, RootNode } from 'codama';
import {
    CodamaError,
    getRecordLinkablesVisitor,
    getResolvedInstructionInputsVisitor,
    isNode,
    LinkableDictionary,
    visit,
} from 'codama';

import { isConvertibleAddress, toAddress } from '../../shared/address';
import { AccountError } from '../../shared/errors';
import type { AccountsInput, ArgumentsInput, EitherSigners, ResolversInput } from '../../shared/types';
import { formatValueType } from '../../shared/util';
import { resolveAccountAddress } from '../resolvers/resolve-account-address';
import { resolveAccountsFallback } from './resolve-accounts-fallback';

// type ResolvedAccountWithAddress = { address: Address; role: AccountRole };
type ResolvedAccount = {
    address: Address | null;
    optional: boolean;
    role: AccountRole;
};
type ResolvedAccountWithAddress = ResolvedAccount & { address: Address };

/**
 * Resolves account addresses and creates AccountMeta for each account in the instruction.
 *
 * Uses two resolution strategies:
 * 1. PRIMARY: Topological sort via getResolvedInstructionInputsVisitor — resolves accounts
 *    sequentially in dependency order. Works for well-formed IDLs without circular deps.
 * 2. FALLBACK: Multi-pass loop — handles circular deps broken by user input, nested argument
 *    dependencies in resolverValueNode.dependsOn, and other cases the static visitor can't handle.
 */
export async function createAccountMeta(
    root: RootNode,
    ixNode: InstructionNode,
    argumentsInput: ArgumentsInput = {},
    accountsInput: AccountsInput = {},
    signers: EitherSigners = [],
    resolversInput: ResolversInput = {},
) {
    // Build LinkableDictionary once — O(1) lookup for PDAs and other linked nodes.
    const linkables = buildLinkables(root);

    let resolvedAddresses: Map<string, Address | null>;
    const programAddress = toAddress(root.program.publicKey);

    try {
        resolvedAddresses = await resolveAccountsTopological(
            root,
            ixNode,
            linkables,
            argumentsInput,
            accountsInput,
            resolversInput,
        );
    } catch (error) {
        if (error instanceof CodamaError) {
            // Topological sort failed (circular deps, invalid deps, etc.) - fallback.
            resolvedAddresses = await resolveAccountsFallback(
                root,
                ixNode,
                linkables,
                argumentsInput,
                accountsInput,
                resolversInput,
            );
        } else {
            throw error;
        }
    }

    // Build AccountMeta array in original account order.
    const accountMetas = ixNode.accounts
        .map(ixAccountNode => {
            // Optional accounts with "programId" strategy: e.g. PMP's setData instruction `buffer` account. (isWritable, isOptional and "programId" strategy).
            // When buffer is null it resolves to the program address which cannot be writable, hence must be downgraded to readonly.
            const resolvedAccountAddress = resolvedAddresses.get(ixAccountNode.name);
            const role =
                resolvedAccountAddress === programAddress
                    ? getReadonlyAccountRole(ixAccountNode, signers)
                    : getAccountRole(ixAccountNode, signers);

            return {
                address: resolvedAccountAddress ?? null,
                optional: Boolean(ixAccountNode.isOptional),
                role,
            };
        })
        // Filter out optional accounts with "omitted" strategy (nulls).
        .filter((acc): acc is ResolvedAccountWithAddress => acc.address !== null);

    // Append remaining accounts from argument values.
    appendRemainingAccounts(accountMetas, ixNode, argumentsInput);

    return accountMetas;
}

/**
 * Primary path: resolve accounts sequentially in topological order.
 */
async function resolveAccountsTopological(
    root: RootNode,
    ixNode: InstructionNode,
    linkables: LinkableDictionary,
    argumentsInput: ArgumentsInput,
    accountsInput: AccountsInput,
    resolversInput: ResolversInput,
): Promise<Map<string, Address | null>> {
    const sortedInputs = visit(ixNode, getResolvedInstructionInputsVisitor());
    const sortedAccountInputs = sortedInputs.filter((input): input is ResolvedInstructionAccount =>
        isNode(input, 'instructionAccountNode'),
    );

    const resolvedAddresses = new Map<string, Address | null>();

    for (const ixAccountNode of sortedAccountInputs) {
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
                linkables,
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
 * Appends remaining accounts from argument values.
 * @see InstructionRemainingAccountsNode
 */
function appendRemainingAccounts(
    accountMetas: AccountMeta[],
    ixNode: InstructionNode,
    argumentsInput: ArgumentsInput,
): void {
    for (const remainingNode of ixNode.remainingAccounts ?? []) {
        if (remainingNode.value.kind !== 'argumentValueNode') {
            throw new AccountError(`Unsupported remaining accounts value kind: "${remainingNode.value.kind}"`);
        }
        const addresses = argumentsInput[remainingNode.value.name];

        if (addresses === undefined) {
            if (!remainingNode.isOptional) {
                throw new AccountError(
                    `Remaining account argument "${remainingNode.value.name}" is required but was not provided`,
                );
            }
            continue;
        }

        if (!Array.isArray(addresses)) {
            throw new AccountError(
                `Remaining account argument "${remainingNode.value.name}" must be an array of addresses`,
            );
        }
        const role = getRemainingAccountRole(remainingNode.isSigner, remainingNode.isWritable);
        for (let i = 0; i < addresses.length; i++) {
            const addr: unknown = addresses[i];
            if (!isConvertibleAddress(addr)) {
                throw new AccountError(
                    `Remaining account argument "${remainingNode.value.name}[${i}]" must be an address string or PublicKey, got ${formatValueType(addr)}`,
                );
            }
            accountMetas.push({ address: toAddress(addr), role });
        }
    }
}

// TODO: 'either' is treated as signer — this works for Token Program multisig signers,
// but may need refinement for programs where 'either' accounts are sometimes non-signers.
function getRemainingAccountRole(isSigner?: boolean | 'either', isWritable?: boolean): AccountRole {
    const signer = isSigner === true || isSigner === 'either';
    const writable = isWritable === true;
    if (writable && signer) return AccountRole.WRITABLE_SIGNER;
    if (writable) return AccountRole.WRITABLE;
    if (signer) return AccountRole.READONLY_SIGNER;
    return AccountRole.READONLY;
}

function getAccountRole(acc: InstructionAccountNode, signers: string[] | undefined): AccountRole {
    const isSigner = isSignerAccount(acc, signers ?? []);
    if (acc.isWritable && isSigner) {
        return AccountRole.WRITABLE_SIGNER;
    }
    if (acc.isWritable) {
        return AccountRole.WRITABLE;
    }
    if (isSigner) {
        return AccountRole.READONLY_SIGNER;
    }
    return AccountRole.READONLY;
}

function getReadonlyAccountRole(acc: InstructionAccountNode, signers: string[] | undefined): AccountRole {
    const isSigner = isSignerAccount(acc, signers ?? []);
    return isSigner ? AccountRole.READONLY_SIGNER : AccountRole.READONLY;
}

function isSignerAccount(acc: InstructionAccountNode, signers: string[]) {
    if (acc.isSigner === 'either') {
        return signers.includes(acc.name);
    }
    return acc.isSigner === true;
}

function buildLinkables(root: RootNode): LinkableDictionary {
    const linkables = new LinkableDictionary();
    visit(root, getRecordLinkablesVisitor(linkables));
    return linkables;
}
