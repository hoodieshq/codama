import {
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__ACCOUNT_RESOLVER_MISSING,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__RESOLVER_EXECUTION_FAILED,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE,
    CodamaError,
} from '@codama/errors';
import type { Address } from '@solana/addresses';
import { address } from '@solana/addresses';
import type { Visitor } from 'codama';
import type {
    AccountBumpValueNode,
    AccountValueNode,
    ArgumentValueNode,
    ConditionalValueNode,
    IdentityValueNode,
    InstructionAccountNode,
    PayerValueNode,
    PdaValueNode,
    ProgramIdValueNode,
    PublicKeyValueNode,
    ResolverValueNode,
} from 'codama';
import { visitOrElse } from 'codama';

import type { AddressInput } from '../../shared/address';
import { isConvertibleAddress, toAddress } from '../../shared/address';
import { formatValueType, safeStringify } from '../../shared/util';
import { resolveAccountValueNodeAddress } from '../resolvers/resolve-account-value-node-address';
import { resolveConditionalValueNodeCondition } from '../resolvers/resolve-conditional';
import { resolvePDAAddress } from '../resolvers/resolve-pda-address';
import type { BaseResolutionContext } from '../resolvers/types';

type AccountDefaultValueVisitorContext = BaseResolutionContext & {
    accountAddressInput: AddressInput | null | undefined;
    ixAccountNode: InstructionAccountNode;
};

/**
 * Visitor for resolving InstructionInputValueNode types to Address values for account resolution.
 */
export function createAccountDefaultValueVisitor(
    ctx: AccountDefaultValueVisitorContext,
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
    const {
        root,
        ixNode,
        ixAccountNode,
        accountAddressInput,
        argumentsInput,
        accountsInput,
        resolversInput,
        resolutionPath,
    } = ctx;

    return {
        visitAccountBumpValue: async (_node: AccountBumpValueNode) => {
            return await Promise.reject(
                new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
                    context: `account default value for ${ixAccountNode.name}`,
                    nodeKind: 'accountBumpValueNode',
                }),
            );
        },

        visitAccountValue: async (node: AccountValueNode) => {
            return await resolveAccountValueNodeAddress(node, {
                accountsInput,
                argumentsInput,
                ixNode,
                resolutionPath,
                resolversInput,
                root,
            });
        },

        visitArgumentValue: async (node: ArgumentValueNode) => {
            const argValue = argumentsInput?.[node.name];
            if (argValue === undefined || argValue === null) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT, {
                    accountName: ixAccountNode.name,
                    instructionName: ixNode.name,
                });
            }

            if (!isConvertibleAddress(argValue)) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: `Argument ${node.name} is not a valid Address. Expected a string or PublicKey, got ${formatValueType(argValue)}`,
                    name: ixAccountNode.name,
                });
            }

            try {
                return await Promise.resolve(toAddress(argValue));
            } catch {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: `Argument ${node.name} cannot be converted to Address`,
                    name: ixAccountNode.name,
                });
            }
        },

        visitConditionalValue: async (conditionalValueNode: ConditionalValueNode) => {
            // ifTrue or ifFalse branch of ConditionalValueNode.
            const resolvedInputValueNode = await resolveConditionalValueNodeCondition({
                accountsInput,
                argumentsInput,
                conditionalValueNode,
                ixAccountNode,
                ixNode,
                resolutionPath,
                resolversInput,
                root,
            });

            if (resolvedInputValueNode === undefined) {
                // No matching branch (e.g. conditional with no ifFalse and falsy condition).
                // Return null to signal "unresolved" to apply optionalAccountStrategy.
                if (ixAccountNode.isOptional) {
                    return null;
                }
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT, {
                    accountName: ixAccountNode.name,
                    instructionName: ixNode.name,
                });
            }
            // Recursively resolve the chosen branch.
            const visitor = createAccountDefaultValueVisitor(ctx);
            const addressValue = await visitOrElse(resolvedInputValueNode, visitor, (innerNode: { kind: string }) => {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
                    context: `account default value for ${ixAccountNode.name}`,
                    nodeKind: innerNode.kind,
                });
            });
            return addressValue;
        },

        visitIdentityValue: async (_node: IdentityValueNode) => {
            if (accountAddressInput === undefined || accountAddressInput === null) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: 'Cannot resolve identity value: account address not provided',
                    name: ixAccountNode.name,
                });
            }
            return await Promise.resolve(toAddress(accountAddressInput));
        },

        visitPayerValue: async (_node: PayerValueNode) => {
            if (accountAddressInput === undefined || accountAddressInput === null) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: 'Cannot resolve payer value: account address not provided',
                    name: ixAccountNode.name,
                });
            }
            return await Promise.resolve(toAddress(accountAddressInput));
        },

        visitPdaValue: async (node: PdaValueNode) => {
            const pda = await resolvePDAAddress({
                accountsInput,
                argumentsInput,
                ixAccountNode,
                ixNode,
                pdaValueNode: node,
                resolutionPath,
                resolversInput,
                root,
            });
            if (pda === null) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: 'Cannot derive PDA',
                    name: ixAccountNode.name,
                });
            }
            return pda[0];
        },

        visitProgramIdValue: async (_node: ProgramIdValueNode) => {
            return await Promise.resolve(address(root.program.publicKey));
        },

        visitPublicKeyValue: async (node: PublicKeyValueNode) => {
            return await Promise.resolve(address(node.publicKey));
        },

        visitResolverValue: async (node: ResolverValueNode) => {
            const resolverFn = resolversInput?.[node.name];
            if (!resolverFn) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__ACCOUNT_RESOLVER_MISSING, {
                    accountName: ixAccountNode.name,
                    resolverName: node.name,
                });
            }
            let result: unknown;
            try {
                result = await resolverFn(argumentsInput ?? {}, accountsInput ?? {});
            } catch (error) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__RESOLVER_EXECUTION_FAILED, {
                    cause: error,
                    resolverName: node.name,
                    targetKind: 'account',
                    targetName: ixAccountNode.name,
                });
            }

            if (!isConvertibleAddress(result)) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                    details: `Resolver "${node.name}" returned invalid address ${safeStringify(result)}`,
                    name: ixAccountNode.name,
                });
            }

            return toAddress(result);
        },
    };
}
