import type { Address } from '@solana/addresses';
import type { AccountMeta } from '@solana/instructions';
import { AccountRole } from '@solana/instructions';
import type { InstructionAccountNode, InstructionNode, RootNode } from 'codama';
import { CodamaError } from 'codama';

import { isConvertibleAddress, toAddress } from '../../shared/address';
import { AccountError } from '../../shared/errors';
import type { AccountsInput, ArgumentsInput, EitherSigners, ResolversInput } from '../../shared/types';
import { formatValueType } from '../../shared/util';
import { resolveAccountAddressesByOrder, resolveAccountAddressesFallback } from '../resolvers';
import { buildIxNodeStack, buildLinkables, type ResolutionContext } from '../resolvers/shared';

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
    // Build static environment once per instruction resolution.
    // Stack path [Root, Program, Instruction] is established here and never mutated.
    // Resolution loop is sequential — no concurrent visitors modifying the stack.
    // Every async resolver extracts needed nodes from stack before its first await.
    const linkables = buildLinkables(root);
    const stack = buildIxNodeStack(root, ixNode);

    const programAddress = toAddress(root.program.publicKey);
    const ctx: ResolutionContext = {
        accountsInput,
        argumentsInput,
        linkables,
        resolvedAddresses: new Map<string, Address | null>(),
        resolversInput,
        stack,
    };

    try {
        ctx.resolvedAddresses = await resolveAccountAddressesByOrder(ctx);
    } catch (error) {
        if (error instanceof CodamaError) {
            // Topological sort failed (circular deps, invalid deps, etc.) - fallback.
            ctx.resolvedAddresses.clear();
            ctx.resolvedAddresses = await resolveAccountAddressesFallback(ctx);
        } else {
            throw error;
        }
    }

    // Build AccountMeta array in original account order.
    const accountMetas = ixNode.accounts
        .map(ixAccountNode => {
            // Optional accounts with "programId" strategy: e.g. PMP's setData instruction `buffer` account. (isWritable, isOptional and "programId" strategy).
            // When buffer is null it resolves to the program address which cannot be writable, hence must be downgraded to readonly.
            const resolvedAccountAddress = ctx.resolvedAddresses.get(ixAccountNode.name) ?? null;
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
            // Required remaining accounts must be provided.
            if (!remainingNode.isOptional) {
                throw new AccountError(
                    `Remaining account argument "${remainingNode.value.name}" is required but was not provided`,
                );
            }
            // Optional remaining accounts can be safely omitted.
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
