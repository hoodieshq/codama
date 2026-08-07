import type { NumberTypeNode } from '@codama/node-types';

/**
 * Returns true when the number type node encodes a signed integer (`i8`..`i128`).
 *
 * @example
 * ```ts
 * isSignedInteger(numberTypeNode('i32')); // true
 * isSignedInteger(numberTypeNode('u32')); // false
 * ```
 */
export function isSignedInteger(node: NumberTypeNode): boolean {
    return node.format.startsWith('i');
}

/**
 * Returns true when the number type node encodes an unsigned integer (`u8`..`u128` or `shortU16`).
 *
 * @example
 * ```ts
 * isUnsignedInteger(numberTypeNode('u32')); // true
 * isUnsignedInteger(numberTypeNode('i32')); // false
 * ```
 */
export function isUnsignedInteger(node: NumberTypeNode): boolean {
    return node.format.startsWith('u') || node.format === 'shortU16';
}

/**
 * Returns true when the number type node encodes an integer, meaning any format that is not a float.
 *
 * @example
 * ```ts
 * isInteger(numberTypeNode('u32')); // true
 * isInteger(numberTypeNode('f32')); // false
 * ```
 */
export function isInteger(node: NumberTypeNode): boolean {
    return !node.format.startsWith('f');
}

/**
 * Returns true when the number type node encodes a floating-point decimal (`f32` or `f64`).
 *
 * @example
 * ```ts
 * isDecimal(numberTypeNode('f32')); // true
 * isDecimal(numberTypeNode('u32')); // false
 * ```
 */
export function isDecimal(node: NumberTypeNode): boolean {
    return node.format.startsWith('f');
}
