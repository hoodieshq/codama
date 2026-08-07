import type { InstructionArgumentNode } from '@codama/node-types';

import { structFieldTypeNode } from './generated/typeNodes/StructFieldTypeNode';
import { structTypeNode } from './generated/typeNodes/StructTypeNode';
import { VALUE_NODE_KINDS } from './generated/valueNodes/ValueNode';
import { isNode } from './Node';

/**
 * Builds a `StructTypeNode` from an array of instruction argument nodes by converting each into a struct field.
 *
 * @example
 * ```ts
 * const struct = structTypeNodeFromInstructionArgumentNodes([
 *     instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
 * ]);
 * ```
 */
export function structTypeNodeFromInstructionArgumentNodes(nodes: InstructionArgumentNode[]) {
    return structTypeNode(nodes.map(structFieldTypeNodeFromInstructionArgumentNode));
}

/**
 * Converts an instruction argument node into a `StructFieldTypeNode`.
 * The default value (and its strategy) is kept only when the default is a value node, otherwise both are dropped.
 *
 * @example
 * ```ts
 * const field = structFieldTypeNodeFromInstructionArgumentNode(
 *     instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
 * );
 * ```
 */
export function structFieldTypeNodeFromInstructionArgumentNode(node: InstructionArgumentNode) {
    if (isNode(node.defaultValue, VALUE_NODE_KINDS)) {
        return structFieldTypeNode({ ...node, defaultValue: node.defaultValue });
    }
    return structFieldTypeNode({
        ...node,
        defaultValue: undefined,
        defaultValueStrategy: undefined,
    });
}
