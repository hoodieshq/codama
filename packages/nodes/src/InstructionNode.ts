import type {
    InstructionArgumentNode,
    InstructionNode,
    OptionalAccountStrategy,
    ProgramNode,
    RootNode,
} from '@codama/node-types';

import { isNode } from './Node';
import { getAllInstructions } from './ProgramNode';

/**
 * Normalises an optional account strategy, defaulting to `programId` when none is provided.
 *
 * @example
 * ```ts
 * parseOptionalAccountStrategy(undefined); // 'programId'
 * parseOptionalAccountStrategy('omitted'); // 'omitted'
 * ```
 */
export function parseOptionalAccountStrategy(
    optionalAccountStrategy: OptionalAccountStrategy | undefined,
): OptionalAccountStrategy {
    return optionalAccountStrategy ?? 'programId';
}

/**
 * Returns all arguments of an instruction, including its extra arguments, as an `InstructionArgumentNode[]`.
 *
 * @example
 * ```ts
 * const allArguments = getAllInstructionArguments(instruction);
 * ```
 */
export function getAllInstructionArguments(node: InstructionNode): InstructionArgumentNode[] {
    return [...(node.arguments ?? []), ...(node.extraArguments ?? [])];
}

/**
 * Returns all instructions with their nested sub-instructions. Accepts a `RootNode`, `ProgramNode` or
 * `InstructionNode`. With `leavesOnly` only the deepest instructions are returned and `subInstructionsFirst`
 * places sub-instructions before their parent.
 *
 * @example
 * ```ts
 * const allInstructionsFromTheRoot = getAllInstructionsWithSubs(rootNode);
 * const leaves = getAllInstructionsWithSubs(programNode, { leavesOnly: true });
 * ```
 */
export function getAllInstructionsWithSubs(
    node: InstructionNode | ProgramNode | RootNode,
    config: { leavesOnly?: boolean; subInstructionsFirst?: boolean } = {},
): InstructionNode[] {
    const { leavesOnly = false, subInstructionsFirst = false } = config;
    if (isNode(node, 'instructionNode')) {
        if (!node.subInstructions || node.subInstructions.length === 0) return [node];
        const subInstructions = node.subInstructions.flatMap(sub => getAllInstructionsWithSubs(sub, config));
        if (leavesOnly) return subInstructions;
        return subInstructionsFirst ? [...subInstructions, node] : [node, ...subInstructions];
    }

    const instructions = isNode(node, 'programNode') ? (node.instructions ?? []) : getAllInstructions(node);

    return instructions.flatMap(instruction => getAllInstructionsWithSubs(instruction, config));
}
