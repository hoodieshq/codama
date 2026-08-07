import type { BytesEncoding } from '@codama/node-types';

import { bytesTypeNode } from './generated/typeNodes/BytesTypeNode';
import { stringTypeNode } from './generated/typeNodes/StringTypeNode';
import { bytesValueNode } from './generated/valueNodes/BytesValueNode';
import { constantValueNode } from './generated/valueNodes/ConstantValueNode';
import { stringValueNode } from './generated/valueNodes/StringValueNode';

/**
 * Creates a `ConstantValueNode` of type `StringTypeNode` from an encoding and a string of data.
 *
 * @example
 * ```ts
 * constantValueNodeFromString('utf8', 'Hello');
 * // Equivalent to:
 * constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello'));
 * ```
 */
export function constantValueNodeFromString<TEncoding extends BytesEncoding>(encoding: TEncoding, string: string) {
    return constantValueNode(stringTypeNode(encoding), stringValueNode(string));
}

/**
 * Creates a `ConstantValueNode` of type `BytesTypeNode` from an encoding and a string of data.
 *
 * @example
 * ```ts
 * constantValueNodeFromBytes('base16', 'FF99CC');
 * // Equivalent to:
 * constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
 * ```
 */
export function constantValueNodeFromBytes<TEncoding extends BytesEncoding>(encoding: TEncoding, data: string) {
    return constantValueNode(bytesTypeNode(), bytesValueNode(encoding, data));
}
