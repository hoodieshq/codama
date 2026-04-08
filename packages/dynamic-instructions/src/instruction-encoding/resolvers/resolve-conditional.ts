import type { ConditionalValueNode, InstructionAccountNode, InstructionInputValueNode } from 'codama';
import { isNode, visitOrElse } from 'codama';

import { AccountError } from '../../shared/errors';
import { createConditionNodeValueVisitor } from '../visitors/condition-node-value';
import { createValueNodeVisitor } from '../visitors/value-node-value';
import { getInstructionFromCtx, type ResolutionContext } from './shared';

export type ResolveConditionalContext = ResolutionContext & {
    conditionalValueNode: ConditionalValueNode;
    ixAccountNode: InstructionAccountNode;
};

/**
 * Evaluates a ConditionalValueNode's condition.
 * Returns the matching branch (ifTrue or ifFalse) as an InstructionInputValueNode or undefined if no branch matches.
 */
export async function resolveConditionalValueNodeCondition(
    ctx: ResolveConditionalContext,
): Promise<InstructionInputValueNode | undefined> {
    const { ixAccountNode, conditionalValueNode } = ctx;
    const ixNode = getInstructionFromCtx(ctx);

    if (!isNode(conditionalValueNode, 'conditionalValueNode')) {
        throw new AccountError(`Expected conditionalValueNode in account ${ixAccountNode.name}`);
    }
    const { condition, value: expectedValueNode, ifTrue, ifFalse } = conditionalValueNode;

    if (!expectedValueNode && !ifTrue && !ifFalse) {
        throw new AccountError('Invalid conditionalValueNode: missing value and branches');
    }

    // Resolve the condition value of ConditionalValueNode.
    const conditionVisitor = createConditionNodeValueVisitor(ctx);
    const actualProvidedValue = await visitOrElse(condition, conditionVisitor, condNode => {
        throw new AccountError(
            `Cannot resolve condition node: ${condNode.kind} in account ${ixAccountNode.name} of ${ixNode.name} instruction`,
        );
    });

    if (!expectedValueNode) {
        return actualProvidedValue ? ifTrue : ifFalse;
    }

    // If expectedValueNode exists, the condition must be equal to expected value.
    const valueVisitor = createValueNodeVisitor();
    const expectedValue = visitOrElse(expectedValueNode, valueVisitor, valueNode => {
        throw new AccountError(
            `Cannot resolve required value node: ${valueNode.kind} in account ${ixAccountNode.name}`,
        );
    });

    if (typeof expectedValue.value === 'object' || typeof actualProvidedValue === 'object') {
        throw new AccountError(
            `Deep equality comparison not yet supported for conditional value in account "${ixAccountNode.name}" of "${ixNode.name}" instruction`,
        );
    }

    return actualProvidedValue === expectedValue.value ? ifTrue : ifFalse;
}
