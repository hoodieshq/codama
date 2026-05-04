import { argumentValueNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS } from '../../../src/visitors/constant-pda-seed-value';
import { makeConstantVisitor } from './constant-pda-seed-value-test-utils';

describe('constant-pda-seed-value: visitArgumentValue', () => {
    test('should throw UNEXPECTED_NODE_KIND — arguments are not resolvable in a constant context', () => {
        const visitor = makeConstantVisitor();
        expect(() => visitor.visitArgumentValue(argumentValueNode('anything'))).toThrow(
            `Expected node of kind [${CONSTANT_PDA_SEED_VALUE_SUPPORTED_NODE_KINDS.join(',')}], got [argumentValueNode]`,
        );
    });
});
