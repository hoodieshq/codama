import type { ReadonlyUint8Array } from '@solana/codecs';
import type { ProgramIdValueNode, ValueNode } from 'codama';
import { visitOrElse } from 'codama';

import {
    type ConstantPdaSeedValueVisitorContext,
    createConstantPdaSeedValueVisitor,
    unexpectedPdaSeedNodeFallback,
} from '../visitors/constant-pda-seed-value';

/**
 * Resolves a constant PDA seed value to raw bytes.
 * Facade over `createConstantPdaSeedValueVisitor` that handles dispatch and
 * throws `UNEXPECTED_NODE_KIND` for value node kinds outside the supported set.
 */
export async function resolveConstantPdaSeedValue(
    node: ProgramIdValueNode | ValueNode,
    ctx: ConstantPdaSeedValueVisitorContext,
): Promise<ReadonlyUint8Array> {
    const visitor = createConstantPdaSeedValueVisitor(ctx);
    return await visitOrElse(node, visitor, unexpectedPdaSeedNodeFallback);
}
