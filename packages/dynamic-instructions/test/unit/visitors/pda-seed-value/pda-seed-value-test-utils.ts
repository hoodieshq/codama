import { address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';
import { instructionNode, programNode, rootNode } from 'codama';

import type { ResolutionContext } from '../../../../src/instruction-encoding/resolvers/shared';
import { createPdaSeedValueVisitor } from '../../../../src/instruction-encoding/visitors/pda-seed-value';
import { buildResolutionContext } from '../../test-utils';

const PROGRAM_PUBLIC_KEY = '11111111111111111111111111111111';

export const rootNodeMock = rootNode(programNode({ name: 'test', publicKey: PROGRAM_PUBLIC_KEY }));

export const ixNodeStub = instructionNode({ name: 'testInstruction' });

type MakeVisitorOverrides = {
    accountsInput?: ResolutionContext['accountsInput'];
    argumentsInput?: ResolutionContext['argumentsInput'];
    ixNode?: InstructionNode;
    programId?: Parameters<typeof createPdaSeedValueVisitor>[0]['programId'];
    resolutionPath?: ResolutionContext['resolutionPath'];
    resolversInput?: ResolutionContext['resolversInput'];
    root?: RootNode;
    seedTypeNode?: Parameters<typeof createPdaSeedValueVisitor>[0]['seedTypeNode'];
};

export function makeVisitor(overrides?: MakeVisitorOverrides) {
    const ixNode = overrides?.ixNode ?? ixNodeStub;
    // Build root that includes the custom ixNode so linkables registers its accounts.
    const root =
        overrides?.root ??
        rootNode(programNode({ instructions: [ixNode], name: 'test', publicKey: PROGRAM_PUBLIC_KEY }));
    return createPdaSeedValueVisitor({
        ...buildResolutionContext(root, ixNode, {
            accountsInput: overrides?.accountsInput,
            argumentsInput: overrides?.argumentsInput,
            resolutionPath: overrides?.resolutionPath,
            resolversInput: overrides?.resolversInput,
        }),
        programId: 'programId' in (overrides ?? {}) ? overrides!.programId! : address(PROGRAM_PUBLIC_KEY),
        seedTypeNode: overrides?.seedTypeNode,
    });
}
