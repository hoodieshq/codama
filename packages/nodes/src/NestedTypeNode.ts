import { CODAMA_ERROR__UNEXPECTED_NESTED_NODE_KIND, CodamaError } from '@codama/errors';
import type { NestedTypeNode, Node, TypeNode } from '@codama/node-types';

import { TYPE_NODE_KINDS } from './generated/typeNodes/TypeNode';
import { isNode } from './Node';

/**
 * Returns the final `TypeNode` wrapped inside a nested type node.
 * `TType` is the wrapped leaf type, so given a `NestedTypeNode<T>` it returns the `T`.
 *
 * @example
 * ```ts
 * const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
 * resolveNestedTypeNode(nestedNode); // stringTypeNode('utf8')
 * ```
 */
export function resolveNestedTypeNode<TType extends TypeNode>(typeNode: NestedTypeNode<TType>): TType {
    switch (typeNode.kind) {
        case 'fixedSizeTypeNode':
        case 'hiddenPrefixTypeNode':
        case 'hiddenSuffixTypeNode':
        case 'postOffsetTypeNode':
        case 'preOffsetTypeNode':
        case 'sentinelTypeNode':
        case 'sizePrefixTypeNode':
            return resolveNestedTypeNode<TType>(typeNode.type as NestedTypeNode<TType>);
        default:
            return typeNode;
    }
}

/**
 * Transforms the final `TypeNode` of a nested type node using the provided mapping function.
 * `TFrom` is the wrapped leaf type and `TTo` the mapped one, so a `NestedTypeNode<TFrom>` becomes a
 * `NestedTypeNode<TTo>` while preserving the surrounding wrappers.
 *
 * @example
 * ```ts
 * const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
 * transformNestedTypeNode(nestedNode, () => stringTypeNode('base64'));
 * // fixedSizeTypeNode(stringTypeNode('base64'), 10)
 * ```
 */
export function transformNestedTypeNode<TFrom extends TypeNode, TTo extends TypeNode>(
    typeNode: NestedTypeNode<TFrom>,
    map: (type: TFrom) => TTo,
): NestedTypeNode<TTo> {
    switch (typeNode.kind) {
        case 'fixedSizeTypeNode':
        case 'hiddenPrefixTypeNode':
        case 'hiddenSuffixTypeNode':
        case 'postOffsetTypeNode':
        case 'preOffsetTypeNode':
        case 'sentinelTypeNode':
        case 'sizePrefixTypeNode':
            return Object.freeze({
                ...typeNode,
                type: transformNestedTypeNode(typeNode.type as NestedTypeNode<TFrom>, map),
            } as NestedTypeNode<TTo>);
        default:
            return map(typeNode);
    }
}

/**
 * Type guard that checks whether the final `TypeNode` of a nested type node is of the given kind or kinds.
 * `TKind` is the leaf type kind (or union of kinds) to match and narrow the wrapped type to.
 *
 * @example
 * ```ts
 * const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
 * isNestedTypeNode(nestedNode, 'stringTypeNode'); // true
 * isNestedTypeNode(nestedNode, 'numberTypeNode'); // false
 * isNestedTypeNode(nestedNode, ['stringTypeNode', 'numberTypeNode']); // true
 * ```
 */
export function isNestedTypeNode<TKind extends TypeNode['kind']>(
    node: Node | null | undefined,
    kind: TKind | TKind[],
): node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>> {
    if (!isNode(node, TYPE_NODE_KINDS)) return false;
    const kinds = Array.isArray(kind) ? kind : [kind];
    const resolved = resolveNestedTypeNode(node);
    return !!node && kinds.includes(resolved.kind as TKind);
}

/**
 * Assertion guard that the final `TypeNode` of a nested type node is of the given kind or kinds.
 * `TKind` is the leaf type kind (or union of kinds) to assert and narrow the wrapped type to.
 * Throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NESTED_NODE_KIND` when the leaf does not match.
 *
 * @example
 * ```ts
 * const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
 * assertIsNestedTypeNode(nestedNode, 'stringTypeNode'); // Ok
 * assertIsNestedTypeNode(nestedNode, 'numberTypeNode'); // Throws a CodamaError
 * ```
 */
export function assertIsNestedTypeNode<TKind extends TypeNode['kind']>(
    node: Node | null | undefined,
    kind: TKind | TKind[],
): asserts node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>> {
    const kinds = Array.isArray(kind) ? kind : [kind];
    if (!isNestedTypeNode(node, kinds)) {
        throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NESTED_NODE_KIND, {
            expectedKinds: kinds,
            kind: node?.kind ?? null,
            node,
        });
    }
}
