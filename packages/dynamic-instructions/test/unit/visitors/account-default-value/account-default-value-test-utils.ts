import { address } from '@solana/addresses';
import type { InstructionAccountNode } from 'codama';
import { instructionAccountNode, instructionNode, programNode, rootNode } from 'codama';

import { createAccountDefaultValueVisitor } from '../../../../src/instruction-encoding/visitors/account-default-value';
import { buildLinkables } from '../../test-utils';

export const programAddress = address('11111111111111111111111111111111');
export const rootNodeMock = rootNode(programNode({ name: 'test', publicKey: programAddress }));

export const ixNodeStub = instructionNode({ name: 'testInstruction' });

export const ixAccountNodeStub: InstructionAccountNode = instructionAccountNode({
    isOptional: false,
    isSigner: false,
    isWritable: false,
    name: 'testAccount',
});

export function makeVisitor(overrides?: Partial<Parameters<typeof createAccountDefaultValueVisitor>[0]>) {
    const root = overrides?.root ?? rootNodeMock;
    return createAccountDefaultValueVisitor({
        accountAddressInput: undefined,
        accountsInput: undefined,
        argumentsInput: undefined,
        ixAccountNode: ixAccountNodeStub,
        ixNode: ixNodeStub,
        linkables: buildLinkables(root),
        resolvedAddresses: new Map(),
        resolversInput: undefined,
        root,
        ...overrides,
    });
}
