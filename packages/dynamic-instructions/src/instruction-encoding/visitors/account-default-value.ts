import type { Address } from '@solana/addresses';
import { address } from '@solana/addresses';
import type { Visitor } from 'codama';
import type {
    AccountBumpValueNode,
    AccountValueNode,
    ArgumentValueNode,
    ConditionalValueNode,
    IdentityValueNode,
    PayerValueNode,
    PdaValueNode,
    ProgramIdValueNode,
    PublicKeyValueNode,
    ResolverValueNode,
} from 'codama';
import { visitOrElse } from 'codama';

import { isConvertibleAddress, toAddress } from '../../shared/address';
import { AccountError, ResolverError } from '../../shared/errors';
import { formatValueType, safeStringify } from '../../shared/util';
import { resolveAccountValueNodeAddress } from '../resolvers/resolve-account-value-node-address';
import { resolveConditionalValueNodeCondition } from '../resolvers/resolve-conditional';
import { resolvePDAAddress } from '../resolvers/resolve-pda-address';
import { type AccountResolutionContext, getInstructionFromCtx, getProgramFromCtx } from '../resolvers/shared';

/**
 * Visitor for resolving InstructionInputValueNode types to Address values for account resolution.
 */
export function createAccountDefaultValueVisitor(
    ctx: AccountResolutionContext,
): Visitor<
    Promise<Address | null>,
    | 'accountBumpValueNode'
    | 'accountValueNode'
    | 'argumentValueNode'
    | 'conditionalValueNode'
    | 'identityValueNode'
    | 'payerValueNode'
    | 'pdaValueNode'
    | 'programIdValueNode'
    | 'publicKeyValueNode'
    | 'resolverValueNode'
> {
    const { ixAccountNode, accountAddressInput, argumentsInput, accountsInput, resolversInput } = ctx;
    const program = getProgramFromCtx(ctx);

    return {
        visitAccountBumpValue: async (_node: AccountBumpValueNode) => {
            return await Promise.reject(
                new AccountError(
                    `AccountBumpValueNode not yet supported for ${ixAccountNode.name} account. ` +
                        `Bump seeds should be derived from PDA derivation.`,
                ),
            );
        },

        visitAccountValue: async (node: AccountValueNode) => {
            return await Promise.resolve(resolveAccountValueNodeAddress(node, ctx));
        },

        visitArgumentValue: async (node: ArgumentValueNode) => {
            const argValue = argumentsInput?.[node.name];
            if (argValue === undefined || argValue === null) {
                throw new AccountError(
                    `Missing required argument for account default: ${node.name} (used by ${ixAccountNode.name})`,
                );
            }

            if (!isConvertibleAddress(argValue)) {
                throw new AccountError(
                    `Argument ${node.name} is not a valid Address. Expected a string or PublicKey, got ${formatValueType(argValue)} for account ${ixAccountNode.name}`,
                );
            }

            try {
                return await Promise.resolve(toAddress(argValue));
            } catch (error) {
                throw new AccountError(
                    `Argument ${node.name} cannot be converted to Address for account ${ixAccountNode.name}`,
                    { cause: error },
                );
            }
        },

        visitConditionalValue: async (conditionalValueNode: ConditionalValueNode) => {
            const ixNode = getInstructionFromCtx(ctx);
            // ifTrue or ifFalse branch of ConditionalValueNode.
            const resolvedInputValueNode = await resolveConditionalValueNodeCondition({
                ...ctx,
                conditionalValueNode,
            });

            if (resolvedInputValueNode === undefined) {
                // No matching branch (e.g. conditional with no ifFalse and falsy condition).
                // Return null to signal "unresolved" to apply optionalAccountStrategy.
                if (ixAccountNode.isOptional) {
                    return null;
                }
                throw new AccountError(
                    `Conditional branch resolved to undefined in account "${ixAccountNode.name}" of "${ixNode && 'name' in ixNode ? ixNode.name : 'unknown'}" instruction`,
                );
            }
            // Recursively resolve the chosen branch.
            const visitor = createAccountDefaultValueVisitor(ctx);
            const addressValue = await visitOrElse(resolvedInputValueNode, visitor, (innerNode: { kind: string }) => {
                throw new AccountError(
                    `Cannot resolve conditional branch node: ${innerNode.kind} in account ${ixAccountNode.name}`,
                );
            });
            return addressValue;
        },

        visitIdentityValue: async (_node: IdentityValueNode) => {
            if (accountAddressInput === undefined || accountAddressInput === null) {
                throw new AccountError(
                    `Cannot resolve identity value for ${ixAccountNode.name}: account address not provided`,
                );
            }
            return await Promise.resolve(toAddress(accountAddressInput));
        },

        visitPayerValue: async (_node: PayerValueNode) => {
            if (accountAddressInput === undefined || accountAddressInput === null) {
                throw new AccountError(
                    `Cannot resolve payer value for ${ixAccountNode.name}: account address not provided`,
                );
            }
            return await Promise.resolve(toAddress(accountAddressInput));
        },

        visitPdaValue: async (node: PdaValueNode) => {
            const pda = await resolvePDAAddress({
                ...ctx,
                pdaValueNode: node,
            });
            if (pda === null) {
                throw new AccountError(`Cannot derive PDA for account ${ixAccountNode.name}`);
            }
            return pda[0];
        },

        visitProgramIdValue: async (_node: ProgramIdValueNode) => {
            return await Promise.resolve(address(program.publicKey));
        },

        visitPublicKeyValue: async (node: PublicKeyValueNode) => {
            return await Promise.resolve(address(node.publicKey));
        },

        visitResolverValue: async (node: ResolverValueNode) => {
            const resolverFn = resolversInput?.[node.name];
            if (!resolverFn) {
                throw new AccountError(
                    `Resolver "${node.name}" not provided for account "${ixAccountNode.name}". ` +
                        `Provide via .resolvers({ ${node.name}: async (args, accounts) => ... })`,
                );
            }
            let result: unknown;
            try {
                result = await resolverFn(argumentsInput ?? {}, accountsInput ?? {});
            } catch (error) {
                throw new ResolverError(
                    `Resolver "${node.name}" threw an error while resolving account "${ixAccountNode.name}"`,
                    { cause: error },
                );
            }

            if (!isConvertibleAddress(result)) {
                throw new AccountError(
                    `Resolver "${node.name}" returned invalid address ${safeStringify(result)} for account "${ixAccountNode.name}"`,
                );
            }

            return toAddress(result);
        },
    };
}
