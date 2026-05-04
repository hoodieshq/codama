import { address } from '@solana/addresses';
import { programNode, rootNode } from 'codama';

import { createConstantPdaSeedValueVisitor } from '../../../src/visitors/constant-pda-seed-value';

const PROGRAM_PUBLIC_KEY = '11111111111111111111111111111111';

export const rootNodeMock = rootNode(programNode({ name: 'test', publicKey: PROGRAM_PUBLIC_KEY }));

export function makeConstantVisitor(overrides?: Partial<Parameters<typeof createConstantPdaSeedValueVisitor>[0]>) {
    return createConstantPdaSeedValueVisitor({
        programId: address(PROGRAM_PUBLIC_KEY),
        root: rootNodeMock,
        ...overrides,
    });
}
