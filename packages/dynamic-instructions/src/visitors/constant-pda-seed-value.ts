import {
    CODAMA_ERROR__DYNAMIC_CLIENT__INVARIANT_VIOLATION,
    CODAMA_ERROR__UNEXPECTED_NODE_KIND,
    CodamaError,
} from '@codama/errors';
import type { Address } from '@solana/addresses';
import type { ReadonlyUint8Array } from '@solana/codecs';
import type {
    AccountValueNode,
    ArgumentValueNode,
    BooleanValueNode,
    BytesValueNode,
    ConstantValueNode,
    Node,
    NoneValueNode,
    NumberValueNode,
    ProgramIdValueNode,
    PublicKeyValueNode,
    RootNode,
    SomeValueNode,
    StringValueNode,
    TypeNode,
    Visitor,
} from 'codama';
import { visitOrElse } from 'codama';

import { toAddress } from '../shared/address';
import { getCodecFromBytesEncoding } from '../shared/bytes-encoding';
import { getMemoizedAddressEncoder, getMemoizedBooleanEncoder, getMemoizedUtf8Codec } from '../shared/codecs';

export const CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS = [
    'booleanValueNode',
    'bytesValueNode',
    'constantValueNode',
    'noneValueNode',
    'numberValueNode',
    'programIdValueNode',
    'publicKeyValueNode',
    'someValueNode',
    'stringValueNode',
] as const;

export const PDA_SEED_VALUE_SUPPORTED_NODE_KINDS = [
    ...CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS,
    'accountValueNode',
    'argumentValueNode',
] as const;

type PdaSeedValueSupportedNodeKind = (typeof PDA_SEED_VALUE_SUPPORTED_NODE_KINDS)[number];

export type ConstantPdaSeedValueVisitorContext = {
    programId: Address;
    root: RootNode;
    seedTypeNode?: TypeNode;
};

export function unexpectedPdaSeedNodeFallback(node: Node): never {
    throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NODE_KIND, {
        expectedKinds: [...PDA_SEED_VALUE_SUPPORTED_NODE_KINDS],
        kind: node.kind,
        node: node,
    });
}

/**
 * Base PDA seed value visitor that handles constant seed kinds only
 * (boolean / bytes / constant / none / number / programId / publicKey / some / string).
 * The account/argument handlers throw by default and are meant to be extended if needed (e.g. for variable seeds).
 */
export function createConstantPdaSeedValueVisitor(
    ctx: ConstantPdaSeedValueVisitorContext,
): Visitor<Promise<ReadonlyUint8Array>, PdaSeedValueSupportedNodeKind> {
    const { programId } = ctx;

    const visitor: Visitor<Promise<ReadonlyUint8Array>, PdaSeedValueSupportedNodeKind> = {
        // Throws error by default since constant seeds should not depend on accounts.
        visitAccountValue: (node: AccountValueNode) => {
            throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NODE_KIND, {
                expectedKinds: CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS,
                kind: node.kind,
                node,
            });
        },

        // Throws error by default since constant seeds should not depend on arguments.
        visitArgumentValue: (node: ArgumentValueNode) => {
            throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NODE_KIND, {
                expectedKinds: CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS,
                kind: node.kind,
                node,
            });
        },

        visitBooleanValue: async (node: BooleanValueNode) =>
            await Promise.resolve(getMemoizedBooleanEncoder().encode(node.boolean)),

        visitBytesValue: async (node: BytesValueNode) => {
            const encodedValue = getCodecFromBytesEncoding(node.encoding).encode(node.data);
            return await Promise.resolve(encodedValue);
        },

        visitConstantValue: async (node: ConstantValueNode) => {
            return await visitOrElse(node.value, visitor, unexpectedPdaSeedNodeFallback);
        },

        visitNoneValue: async (_node: NoneValueNode) => await Promise.resolve(new Uint8Array(0)),

        visitNumberValue: async (node: NumberValueNode) => {
            // Sanity check: a violation here indicates a malformed IDL, not a user input error.
            if (!Number.isInteger(node.number) || node.number < 0 || node.number > 0xff) {
                throw new CodamaError(CODAMA_ERROR__DYNAMIC_CLIENT__INVARIANT_VIOLATION, {
                    message: `NumberValueNode PDA seed is out of range: must be a valid u8 (0–255), got ${node.number}`,
                });
            }
            return await Promise.resolve(new Uint8Array([node.number]));
        },

        visitProgramIdValue: async (_node: ProgramIdValueNode) => {
            return await Promise.resolve(getMemoizedAddressEncoder().encode(toAddress(programId)));
        },

        visitPublicKeyValue: async (node: PublicKeyValueNode) => {
            return await Promise.resolve(getMemoizedAddressEncoder().encode(toAddress(node.publicKey)));
        },

        visitSomeValue: async (node: SomeValueNode) => {
            return await visitOrElse(node.value, visitor, unexpectedPdaSeedNodeFallback);
        },

        visitStringValue: async (node: StringValueNode) =>
            await Promise.resolve(getMemoizedUtf8Codec().encode(node.string)),
    };

    return visitor;
}
