import type { EnumTypeNode } from '@codama/node-types';

/**
 * Returns true when every variant of the enum is empty, meaning the enum carries no associated data.
 *
 * @example
 * ```ts
 * isScalarEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // true
 * isScalarEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // false
 * ```
 */
export function isScalarEnum(node: EnumTypeNode): boolean {
    return (node.variants ?? []).every(variant => variant.kind === 'enumEmptyVariantTypeNode');
}

/**
 * Returns true when at least one variant of the enum carries associated data (a tuple or struct variant).
 *
 * @example
 * ```ts
 * isDataEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // true
 * isDataEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // false
 * ```
 */
export function isDataEnum(node: EnumTypeNode): boolean {
    return !isScalarEnum(node);
}
