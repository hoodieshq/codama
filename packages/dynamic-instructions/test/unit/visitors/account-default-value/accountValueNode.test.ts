import { accountValueNode, instructionAccountNode, instructionNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { SvmTestContext } from '../../../svm-test-context';
import { makeVisitor } from './account-default-value-test-utils';

describe('account-default-value: visitAccountValue', async () => {
    const refAddress = await SvmTestContext.generateAddress();
    const ixNodeWithAccount = instructionNode({
        accounts: [
            instructionAccountNode({
                isOptional: false,
                isSigner: false,
                isWritable: false,
                name: 'refAccount',
            }),
        ],
        name: 'testInstruction',
    });

    test('should return address when user provides address in accountsInput', async () => {
        const visitor = makeVisitor({
            accountsInput: { refAccount: refAddress },
            ixNode: ixNodeWithAccount,
        });
        const result = await visitor.visitAccountValue(accountValueNode('refAccount'));
        expect(result).toBe(refAddress);
    });

    test('should return null for optional account with null input and omitted strategy', async () => {
        const ixNodeWithOptional = instructionNode({
            accounts: [
                instructionAccountNode({
                    isOptional: true,
                    isSigner: false,
                    isWritable: false,
                    name: 'refAccount',
                }),
            ],
            name: 'testInstruction',
            optionalAccountStrategy: 'omitted',
        });
        // Pre-populate resolvedAddresses to simulate topological resolution having resolved
        // the optional account to null (omitted strategy)
        const resolvedAddresses = new Map<string, null>([['refAccount', null]]);
        const visitor = makeVisitor({
            accountsInput: { refAccount: null },
            ixNode: ixNodeWithOptional,
            resolvedAddresses,
        });
        const result = await visitor.visitAccountValue(accountValueNode('refAccount'));
        expect(result).toBeNull();
    });

    test('should resolve referenced account from resolvedAddresses map', async () => {
        const expectedDefaultAddress = await SvmTestContext.generateAddress();
        // Pre-populate resolvedAddresses to simulate topological resolution
        const resolvedAddresses = new Map([['refAccount', expectedDefaultAddress]]);
        const visitor = makeVisitor({
            ixNode: ixNodeWithAccount,
            resolvedAddresses,
        });
        const result = await visitor.visitAccountValue(accountValueNode('refAccount'));
        expect(result).toBe(expectedDefaultAddress);
    });

    test('should throw for unknown account reference', async () => {
        const visitor = makeVisitor();
        await expect(visitor.visitAccountValue(accountValueNode('unknown'))).rejects.toThrow(
            /Referenced account "unknown" not found in instruction "testInstruction"/,
        );
    });
});
