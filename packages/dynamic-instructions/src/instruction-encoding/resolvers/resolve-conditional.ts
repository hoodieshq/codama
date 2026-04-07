import {
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL,
    CODAMA_ERROR__UNEXPECTED_NODE_KIND,
    CodamaError,
} from '@codama/errors';
import type { ConditionalValueNode, InstructionAccountNode, InstructionInputValueNode, Node } from 'codama';
import { isNode, visitOrElse } from 'codama';

import { createConditionNodeValueVisitor } from '../visitors/condition-node-value';
import { createValueNodeVisitor } from '../visitors/value-node-value';
import type { BaseResolutionContext } from './types';

export type ResolveConditionalContext = BaseResolutionContext & {
    conditionalValueNode: ConditionalValueNode;
    ixAccountNode: InstructionAccountNode;
};

/**
 * Evaluates a ConditionalValueNode's condition.
 * Returns the matching branch (ifTrue or ifFalse) as an InstructionInputValueNode or undefined if no branch matches.
 */
export async function resolveConditionalValueNodeCondition({
    root,
    ixNode,
    ixAccountNode,
    conditionalValueNode,
    argumentsInput,
    accountsInput,
    resolutionPath,
    resolversInput,
}: ResolveConditionalContext): Promise<InstructionInputValueNode | undefined> {
    if (!isNode(conditionalValueNode, 'conditionalValueNode')) {
        throw new CodamaError(CODAMA_ERROR__UNEXPECTED_NODE_KIND, {
            expectedKinds: ['conditionalValueNode'],
            kind: (conditionalValueNode as unknown as { kind: Node['kind'] })?.kind,
            node: conditionalValueNode,
        });
    }
    const { condition, value: expectedValueNode, ifTrue, ifFalse } = conditionalValueNode;

    if (!expectedValueNode && !ifTrue && !ifFalse) {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL, {
            accountName: ixAccountNode.name,
            details: 'Invalid conditionalValueNode: missing value and branches',
            instructionName: ixNode.name,
        });
    }

    // Resolve the condition value of ConditionalValueNode.
    const conditionVisitor = createConditionNodeValueVisitor({
        accountsInput,
        argumentsInput,
        ixNode,
        resolutionPath,
        resolversInput,
        root,
    });
    const actualProvidedValue = await visitOrElse(condition, conditionVisitor, condNode => {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL, {
            accountName: ixAccountNode.name,
            details: `Cannot resolve condition node: ${condNode.kind}`,
            instructionName: ixNode.name,
        });
    });

    if (!expectedValueNode) {
        return actualProvidedValue ? ifTrue : ifFalse;
    }

    // If expectedValueNode exists, the condition must be equal to expected value.
    const valueVisitor = createValueNodeVisitor();
    const expectedValue = visitOrElse(expectedValueNode, valueVisitor, valueNode => {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL, {
            accountName: ixAccountNode.name,
            details: `Cannot resolve required value node: ${valueNode.kind}`,
            instructionName: ixNode.name,
        });
    });

    if (typeof expectedValue.value === 'object' || typeof actualProvidedValue === 'object') {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL, {
            accountName: ixAccountNode.name,
            details: 'Deep equality comparison not yet supported for conditional value',
            instructionName: ixNode.name,
        });
    }

    return actualProvidedValue === expectedValue.value ? ifTrue : ifFalse;
}
