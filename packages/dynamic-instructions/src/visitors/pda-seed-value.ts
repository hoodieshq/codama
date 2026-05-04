import { getNodeCodec } from '@codama/dynamic-codecs';
import {
    CODAMA_ERROR__DYNAMIC_CLIENT__ARGUMENT_MISSING,
    CODAMA_ERROR__DYNAMIC_CLIENT__FAILED_TO_DERIVE_PDA,
    CODAMA_ERROR__DYNAMIC_CLIENT__NODE_REFERENCE_NOT_FOUND,
    CodamaError,
} from '@codama/errors';
import type { Address } from '@solana/addresses';
import type { ReadonlyUint8Array } from '@solana/codecs';
import type { AccountValueNode, ArgumentValueNode, TypeNode, Visitor } from 'codama';
import { extendVisitor, isNode, visitOrElse } from 'codama';

import { resolveAccountValueNodeAddress } from '../resolvers/resolve-account-value-node-address';
import type { BaseResolutionContext } from '../resolvers/types';
import { getMemoizedAddressEncoder } from '../shared/codecs';
import {
    createConstantPdaSeedValueVisitor,
    PDA_SEED_VALUE_SUPPORTED_NODE_KINDS,
    unexpectedPdaSeedNodeFallback,
} from './constant-pda-seed-value';
import { createInputValueTransformer } from './input-value-transformer';

export { PDA_SEED_VALUE_SUPPORTED_NODE_KINDS };

type PdaSeedValueSupportedNodeKind = (typeof PDA_SEED_VALUE_SUPPORTED_NODE_KINDS)[number];

type PdaSeedValueVisitorContext = BaseResolutionContext & {
    programId: Address;
    seedTypeNode?: TypeNode;
};

/**
 * Visitor for resolving PdaSeedValueNode value to raw bytes.
 * Supports recursive resolution of dependent PDAs (accounts that are themselves auto-derived PDAs).
 * This is used for both:
 * - Variable seeds (e.g. seeds based on instruction accounts/arguments), and
 * - Constant seeds (e.g. bytes/string/programId/publicKey constants).
 */
export function createPdaSeedValueVisitor(
    ctx: PdaSeedValueVisitorContext,
): Visitor<Promise<ReadonlyUint8Array>, PdaSeedValueSupportedNodeKind> {
    const { root, ixNode, programId, seedTypeNode, resolversInput, resolutionPath } = ctx;
    const accountsInput = ctx.accountsInput ?? {};
    const argumentsInput = ctx.argumentsInput ?? {};

    const base = createConstantPdaSeedValueVisitor({ programId, root, seedTypeNode });

    const visitor = extendVisitor(base, {
        visitAccountValue: async (node: AccountValueNode) => {
            const resolvedAddress = await resolveAccountValueNodeAddress(node, {
                accountsInput,
                argumentsInput,
                ixNode,
                resolutionPath,
                resolversInput,
                root,
            });

            if (resolvedAddress === null) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_CLIENT__FAILED_TO_DERIVE_PDA, {
                    accountName: node.name,
                });
            }

            return getMemoizedAddressEncoder().encode(resolvedAddress);
        },

        visitArgumentValue: async (node: ArgumentValueNode) => {
            const ixArgumentNode = ixNode.arguments.find(arg => arg.name === node.name);
            if (!ixArgumentNode) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_CLIENT__NODE_REFERENCE_NOT_FOUND, {
                    instructionName: ixNode.name,
                    referencedName: node.name,
                });
            }
            const argInput = argumentsInput[node.name];

            // Use the PDA seed's declared type (e.g. plain stringTypeNode) rather than
            // the instruction argument's type (e.g. sizePrefixTypeNode) so the seed
            // bytes match what the on-chain program derives.
            const typeNode = seedTypeNode ?? ixArgumentNode.type;

            if (argInput === undefined || argInput === null) {
                // optional remainderOptionTypeNode seeds encodes to zero bytes.
                if (isNode(typeNode, 'remainderOptionTypeNode')) {
                    return new Uint8Array(0);
                }
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_CLIENT__ARGUMENT_MISSING, {
                    argumentName: node.name,
                    instructionName: ixNode.name,
                });
            }
            const codec = getNodeCodec([root, root.program, ixNode, { ...ixArgumentNode, type: typeNode }]);
            const transformer = createInputValueTransformer(typeNode, root, {
                bytesEncoding: 'base16',
            });
            const transformedInput = transformer(argInput);
            return await Promise.resolve(codec.encode(transformedInput));
        },
    });

    // Re-point constant/some recursion at the full visitor so nested account/argument values resolve correctly.
    visitor.visitConstantValue = async node => await visitOrElse(node.value, visitor, unexpectedPdaSeedNodeFallback);
    visitor.visitSomeValue = async node => await visitOrElse(node.value, visitor, unexpectedPdaSeedNodeFallback);

    return visitor;
}
