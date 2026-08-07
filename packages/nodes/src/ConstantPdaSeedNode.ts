import type { BytesEncoding } from '@codama/node-types';

import { programIdValueNode } from './generated/contextualValueNodes/ProgramIdValueNode';
import { constantPdaSeedNode } from './generated/pdaSeedNodes/ConstantPdaSeedNode';
import { bytesTypeNode } from './generated/typeNodes/BytesTypeNode';
import { publicKeyTypeNode } from './generated/typeNodes/PublicKeyTypeNode';
import { stringTypeNode } from './generated/typeNodes/StringTypeNode';
import { bytesValueNode } from './generated/valueNodes/BytesValueNode';
import { stringValueNode } from './generated/valueNodes/StringValueNode';

/**
 * Creates a `ConstantPdaSeedNode` whose value is the program id, of type `PublicKeyTypeNode`.
 *
 * @example
 * ```ts
 * constantPdaSeedNodeFromProgramId();
 * // Equivalent to:
 * constantPdaSeedNode(publicKeyTypeNode(), programIdValueNode());
 * ```
 */
export function constantPdaSeedNodeFromProgramId() {
    return constantPdaSeedNode(publicKeyTypeNode(), programIdValueNode());
}

/**
 * Creates a `ConstantPdaSeedNode` of type `StringTypeNode` from an encoding and a string of data.
 *
 * @example
 * ```ts
 * constantPdaSeedNodeFromString('utf8', 'tickets');
 * // Equivalent to:
 * constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('tickets'));
 * ```
 */
export function constantPdaSeedNodeFromString<TEncoding extends BytesEncoding>(encoding: TEncoding, string: string) {
    return constantPdaSeedNode(stringTypeNode(encoding), stringValueNode(string));
}

/**
 * Creates a `ConstantPdaSeedNode` of type `BytesTypeNode` from an encoding and a string of data.
 *
 * @example
 * ```ts
 * constantPdaSeedNodeFromBytes('base16', 'FF99CC');
 * // Equivalent to:
 * constantPdaSeedNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
 * ```
 */
export function constantPdaSeedNodeFromBytes<TEncoding extends BytesEncoding>(encoding: TEncoding, data: string) {
    return constantPdaSeedNode(bytesTypeNode(), bytesValueNode(encoding, data));
}
