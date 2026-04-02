import { address } from '@solana/addresses';
import type { InstructionAccountNode, InstructionNode, RootNode } from 'codama';
import { instructionAccountNode, instructionNode, programNode, rootNode } from 'codama';

import type { AccountResolutionContext } from '../../../../src/instruction-encoding/resolvers/shared';
import { createAccountDefaultValueVisitor } from '../../../../src/instruction-encoding/visitors/account-default-value';
import { buildResolutionContext } from '../../test-utils';

export const programAddress = address('11111111111111111111111111111111');
export const rootNodeMock = rootNode(programNode({ name: 'test', publicKey: programAddress }));

export const ixNodeStub = instructionNode({ name: 'testInstruction' });

export const ixAccountNodeStub: InstructionAccountNode = instructionAccountNode({
    isOptional: false,
    isSigner: false,
    isWritable: false,
    name: 'testAccount',
});

type MakeVisitorOverrides = {
    accountAddressInput?: AccountResolutionContext['accountAddressInput'];
    accountsInput?: AccountResolutionContext['accountsInput'];
    argumentsInput?: AccountResolutionContext['argumentsInput'];
    ixAccountNode?: InstructionAccountNode;
    ixNode?: InstructionNode;
    resolvedAddresses?: AccountResolutionContext['resolvedAddresses'];
    resolversInput?: AccountResolutionContext['resolversInput'];
    root?: RootNode;
};

export function makeVisitor(overrides?: MakeVisitorOverrides) {
    const ixNode = overrides?.ixNode ?? ixNodeStub;
    // Build root that includes the custom ixNode so linkables registers its accounts.
    const root =
        overrides?.root ?? rootNode(programNode({ instructions: [ixNode], name: 'test', publicKey: programAddress }));
    const ctx = buildResolutionContext(root, ixNode, {
        accountsInput: overrides?.accountsInput,
        argumentsInput: overrides?.argumentsInput,
        resolvedAddresses: overrides?.resolvedAddresses,
        resolversInput: overrides?.resolversInput,
    });
    return createAccountDefaultValueVisitor({
        ...ctx,
        accountAddressInput: overrides?.accountAddressInput ?? undefined,
        ixAccountNode: overrides?.ixAccountNode ?? ixAccountNodeStub,
    });
}
