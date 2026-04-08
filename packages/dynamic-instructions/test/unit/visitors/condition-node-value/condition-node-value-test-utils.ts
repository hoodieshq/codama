import type { InstructionNode, RootNode } from 'codama';
import { instructionNode, programNode, rootNode } from 'codama';

import type { ResolutionContext } from '../../../../src/instruction-encoding/resolvers/shared';
import { createConditionNodeValueVisitor } from '../../../../src/instruction-encoding/visitors/condition-node-value';
import { buildResolutionContext } from '../../test-utils';

const ixNodeStub = instructionNode({ name: 'testInstruction' });

type MakeVisitorOverrides = {
    accountsInput?: ResolutionContext['accountsInput'];
    argumentsInput?: ResolutionContext['argumentsInput'];
    ixNode?: InstructionNode;
    resolutionPath?: ResolutionContext['resolutionPath'];
    resolversInput?: ResolutionContext['resolversInput'];
    root?: RootNode;
};

export function makeVisitor(overrides?: MakeVisitorOverrides) {
    const ixNode = overrides?.ixNode ?? ixNodeStub;
    const root =
        overrides?.root ??
        rootNode(programNode({ instructions: [ixNode], name: 'test', publicKey: '11111111111111111111111111111111' }));
    return createConditionNodeValueVisitor(
        buildResolutionContext(root, ixNode, {
            accountsInput: overrides?.accountsInput,
            argumentsInput: overrides?.argumentsInput,
            resolutionPath: overrides?.resolutionPath,
            resolversInput: overrides?.resolversInput,
        }),
    );
}
