import type {
    AccountNode,
    ConstantNode,
    DefinedTypeNode,
    ErrorNode,
    EventNode,
    InstructionNode,
    PdaNode,
    ProgramNode,
    RootNode,
} from '@codama/node-types';

/**
 * Returns all `ProgramNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` (returned as a
 * single-element array) or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allPrograms = getAllPrograms(rootNode);
 * ```
 */
export function getAllPrograms(node: ProgramNode | ProgramNode[] | RootNode): ProgramNode[] {
    if (Array.isArray(node)) return node;
    if (node.kind === 'programNode') return [node];
    return [node.program, ...(node.additionalPrograms ?? [])];
}

/**
 * Returns all `PdaNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allPdas = getAllPdas(rootNode);
 * ```
 */
export function getAllPdas(node: ProgramNode | ProgramNode[] | RootNode): PdaNode[] {
    return getAllPrograms(node).flatMap(program => program.pdas ?? []);
}

/**
 * Returns all `AccountNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allAccounts = getAllAccounts(rootNode);
 * ```
 */
export function getAllAccounts(node: ProgramNode | ProgramNode[] | RootNode): AccountNode[] {
    return getAllPrograms(node).flatMap(program => program.accounts ?? []);
}

/**
 * Returns all `EventNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allEvents = getAllEvents(rootNode);
 * ```
 */
export function getAllEvents(node: ProgramNode | ProgramNode[] | RootNode): EventNode[] {
    return getAllPrograms(node).flatMap(program => program.events ?? []);
}

/**
 * Returns all `DefinedTypeNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
 * `ProgramNode`.
 *
 * @example
 * ```ts
 * const allDefinedTypes = getAllDefinedTypes(rootNode);
 * ```
 */
export function getAllDefinedTypes(node: ProgramNode | ProgramNode[] | RootNode): DefinedTypeNode[] {
    return getAllPrograms(node).flatMap(program => program.definedTypes ?? []);
}

/**
 * Returns all `InstructionNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
 * `ProgramNode`.
 *
 * @example
 * ```ts
 * const allInstructions = getAllInstructions(rootNode);
 * ```
 */
export function getAllInstructions(node: ProgramNode | ProgramNode[] | RootNode): InstructionNode[] {
    return getAllPrograms(node).flatMap(program => program.instructions ?? []);
}

/**
 * Returns all `ErrorNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allErrors = getAllErrors(rootNode);
 * ```
 */
export function getAllErrors(node: ProgramNode | ProgramNode[] | RootNode): ErrorNode[] {
    return getAllPrograms(node).flatMap(program => program.errors ?? []);
}

/**
 * Returns all `ConstantNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.
 *
 * @example
 * ```ts
 * const allConstants = getAllConstants(rootNode);
 * ```
 */
export function getAllConstants(node: ProgramNode | ProgramNode[] | RootNode): ConstantNode[] {
    return getAllPrograms(node).flatMap(program => program.constants ?? []);
}
