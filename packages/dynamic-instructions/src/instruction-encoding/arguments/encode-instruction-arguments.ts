import { getNodeCodec, type ReadonlyUint8Array } from '@codama/dynamic-codecs';
import type { InstructionNode, RootNode } from 'codama';
import { visitOrElse } from 'codama';

import { concatBytes } from '../../shared/bytes-encoding';
import { ArgumentError } from '../../shared/errors';
import type { ArgumentsInput } from '../../shared/types';
import { createDefaultValueEncoderVisitor, createInputValueTransformer } from '../visitors';
import { isOmittedArgument, isOptionalArgument } from './shared';

/**
 * Encodes all instruction arguments into a single byte array.
 * Iterates over each InstructionArgumentNode and encodes based on its category:
 *
 * Omitted arguments use their default value.
 * Optional arguments are encoded as null.
 * Required arguments are transformed from user input and then encoded.
 */
export function encodeInstructionArguments(
    root: RootNode,
    ix: InstructionNode,
    argumentsInput: ArgumentsInput = {},
): ReadonlyUint8Array {
    const chunks = ix.arguments.map(ixArgumentNode => {
        const input = argumentsInput?.[ixArgumentNode.name];
        if (isOmittedArgument(ixArgumentNode)) {
            return encodeOmittedArgument(root, ix, ixArgumentNode);
        } else if (isOptionalArgument(ixArgumentNode, input)) {
            return encodeOptionalArgument(root, ix, ixArgumentNode);
        } else {
            return encodeRequiredArgument(root, ix, ixArgumentNode, input);
        }
    });

    return concatBytes(chunks);
}

function encodeOmittedArgument(
    root: RootNode,
    ix: InstructionNode,
    ixArgumentNode: InstructionNode['arguments'][number],
): ReadonlyUint8Array {
    const nodeCodec = getNodeCodec([root, root.program, ix, ixArgumentNode]);
    const defaultValue = ixArgumentNode.defaultValue;
    if (defaultValue === undefined) {
        throw new ArgumentError(`Omitted argument ${ixArgumentNode.name} has no default value`);
    }

    const visitor = createDefaultValueEncoderVisitor(nodeCodec);
    return visitOrElse(defaultValue, visitor, node => {
        throw new ArgumentError(
            `Not supported encoding for ${ixArgumentNode.name} argument of "${ixArgumentNode.type.kind}" kind (defaultValue: ${node.kind})`,
        );
    });
}

function encodeOptionalArgument(
    root: RootNode,
    ix: InstructionNode,
    ixArgumentNode: InstructionNode['arguments'][number],
): ReadonlyUint8Array {
    const nodeCodec = getNodeCodec([root, root.program, ix, ixArgumentNode]);
    try {
        return nodeCodec.encode(null);
    } catch (error) {
        throw new ArgumentError(
            `Failed to encode optional argument "${ixArgumentNode.name}" of "${ix.name}" instruction`,
            { cause: error },
        );
    }
}

function encodeRequiredArgument(
    root: RootNode,
    ix: InstructionNode,
    ixArgumentNode: InstructionNode['arguments'][number],
    input: ArgumentsInput[string],
): ReadonlyUint8Array {
    if (input === undefined) {
        throw new ArgumentError(`Missing required argument: ${ixArgumentNode.name}`);
    }

    const nodeCodec = getNodeCodec([root, root.program, ix, ixArgumentNode]);
    const transformer = createInputValueTransformer(ixArgumentNode.type, root, {
        bytesEncoding: 'base16',
    });
    const transformedInput = transformer(input);
    try {
        return nodeCodec.encode(transformedInput);
    } catch (error) {
        throw new ArgumentError(
            `Failed to encode required argument "${ixArgumentNode.name}" of "${ix.name}" instruction`,
            {
                cause: error,
            },
        );
    }
}
