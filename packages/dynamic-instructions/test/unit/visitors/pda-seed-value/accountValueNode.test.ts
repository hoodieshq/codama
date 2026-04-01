import { address, getAddressEncoder } from '@solana/addresses';
import { accountValueNode, instructionAccountNode, instructionNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { SvmTestContext } from '../../../svm-test-context';
import { makeVisitor } from './pda-seed-value-test-utils';

describe('pda-seed-value: visitAccountValue', () => {
    const ixNodeWithAccount = instructionNode({
        accounts: [
            instructionAccountNode({
                isSigner: false,
                isWritable: false,
                name: 'authority',
            }),
        ],
        name: 'testInstruction',
    });

    test('should encode provided account address', async () => {
        const randomAddress = await new SvmTestContext().createAccount();
        const visitor = makeVisitor({
            accountsInput: { authority: randomAddress },
            ixNode: ixNodeWithAccount,
        });
        const result = await visitor.visitAccountValue(accountValueNode('authority'));
        expect(result).toEqual(getAddressEncoder().encode(address(randomAddress)));
    });

    test('should fall through to map lookup when provided address is null', async () => {
        const visitor = makeVisitor({
            accountsInput: { authority: null },
            ixNode: ixNodeWithAccount,
        });
        // null is not treated as a provided address — it falls through to resolvedAddresses map lookup,
        // which throws because the account has not been resolved yet (empty map in unit test)
        await expect(visitor.visitAccountValue(accountValueNode('authority'))).rejects.toThrow(
            /Account "authority" has not been resolved yet/,
        );
    });

    test('should throw when resolved address is null', async () => {
        const ixNodeWithOptionalAccount = instructionNode({
            accounts: [
                instructionAccountNode({
                    isOptional: true,
                    isSigner: false,
                    isWritable: false,
                    name: 'authority',
                }),
            ],
            name: 'testInstruction',
            optionalAccountStrategy: 'omitted',
        });
        // Pre-populate resolvedAddresses with null to simulate an omitted optional account
        const resolvedAddresses = new Map<string, null>([['authority', null]]);
        const visitor = makeVisitor({
            accountsInput: { authority: null },
            ixNode: ixNodeWithOptionalAccount,
            resolvedAddresses,
        });
        await expect(visitor.visitAccountValue(accountValueNode('authority'))).rejects.toThrow(
            /Cannot resolve dependent account for PDA seed/,
        );
    });

    test('should throw for unknown account reference', async () => {
        const visitor = makeVisitor({ ixNode: ixNodeWithAccount });
        await expect(visitor.visitAccountValue(accountValueNode('nonexistent'))).rejects.toThrow(
            /Referenced account "nonexistent" not found in instruction "testInstruction"/,
        );
    });
});
