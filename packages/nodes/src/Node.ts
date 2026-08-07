import { CODAMA_ERROR__UNEXPECTED_NODE_KIND, CodamaError } from '@codama/errors';
import type { GetNodeFromKind, Node, NodeKind } from '@codama/node-types';

/**
 * Type guard that narrows a node to the given kind or kinds.
 * `TKind` is the node kind (or union of kinds) to match and narrow to via `GetNodeFromKind`.
 * Returns false for null or undefined.
 *
 * @example
 * ```ts
 * isNode(numberTypeNode('u32'), 'numberTypeNode'); // true
 * isNode(numberTypeNode('u32'), ['stringTypeNode', 'numberTypeNode']); // true
 * isNode(null, 'numberTypeNode'); // false
 * ```
 */
export function isNode<TKind extends NodeKind>(
    node: Node | null | undefined,
    kind: TKind | TKind[],
): node is GetNodeFromKind<TKind> {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return !!node && (kinds as NodeKind[]).includes(node.kind);
}

/**
 * Assertion guard that narrows a node to the given kind or kinds.
 * `TKind` is the node kind (or union of kinds) to assert and narrow to via `GetNodeFromKind`.
 * Throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND` when the node does not match.
 *
 * @example
 * ```ts
 * assertIsNode(numberTypeNode('u32'), 'numberTypeNode'); // Ok
 * assertIsNode(numberTypeNode('u32'), 'stringTypeNode'); // Throws a CodamaError
 * ```
 */
export function assertIsNode<TKind extends NodeKind>(
    node: Node | null | undefined,
    kind: TKind | TKind[],
): asserts node is GetNodeFromKind<TKind> {
    const kinds = Array.isArray(kind) ? kind : [kind];
    if (!isNode(node, kinds)) {
        throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NODE_KIND, {
            expectedKinds: kinds,
            kind: node?.kind ?? null,
            node,
        });
    }
}

/**
 * Returns a predicate that narrows a node to the given kind or kinds, suitable for `Array.filter`.
 * `TKind` is the node kind (or union of kinds) the returned predicate matches and narrows to.
 *
 * @example
 * ```ts
 * const numberNodes = nodes.filter(isNodeFilter('numberTypeNode'));
 * ```
 */
export function isNodeFilter<TKind extends NodeKind>(
    kind: TKind | TKind[],
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
    return (node): node is GetNodeFromKind<TKind> => isNode(node, kind);
}

/**
 * Returns a predicate that asserts each node is of the given kind or kinds, suitable for `Array.filter`.
 * `TKind` is the node kind (or union of kinds) to assert and narrow to.
 * The predicate throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND` on any mismatch.
 *
 * @example
 * ```ts
 * const numberNodes = nodes.filter(assertIsNodeFilter('numberTypeNode')); // Throws on a non-number node
 * ```
 */
export function assertIsNodeFilter<TKind extends NodeKind>(
    kind: TKind | TKind[],
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
    return (node): node is GetNodeFromKind<TKind> => {
        assertIsNode(node, kind);
        return true;
    };
}

/**
 * Returns a predicate that drops null and undefined values and asserts the remaining nodes are of the given kind.
 * `TKind` is the node kind (or union of kinds) to assert and narrow to for non-nullish nodes.
 * Non-nullish nodes that do not match throw a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND`.
 *
 * @example
 * ```ts
 * const numberNodes = maybeNodes.filter(removeNullAndAssertIsNodeFilter('numberTypeNode'));
 * ```
 */
export function removeNullAndAssertIsNodeFilter<TKind extends NodeKind>(
    kind: TKind | TKind[],
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
    return (node): node is GetNodeFromKind<TKind> => {
        if (node) assertIsNode(node, kind);
        return node != null;
    };
}
