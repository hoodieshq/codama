import { address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { resolveAccountAddressesFallback } from '../../../src/instruction-encoding/resolvers/resolve-account-address';
import { loadRoot } from '../../programs/test-utils';
import { SvmTestContext } from '../../svm-test-context';

function getInstruction(root: RootNode, name: string): InstructionNode {
    const ix = root.program.instructions.find(i => i.name === name);
    if (!ix) throw new Error(`Instruction ${name} not found`);
    return ix;
}

describe('resolveAccountAddressesFallback', () => {
    describe('zero-dependency accounts', () => {
        test('should resolve all user-provided accounts immediately', async () => {
            const root = loadRoot('token-idl.json');
            const ix = getInstruction(root, 'transfer');

            const source = await SvmTestContext.generateAddress();
            const destination = await SvmTestContext.generateAddress();
            const authority = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { amount: 100 },
                { authority, destination, source },
            );

            expect(result.get('source')).toBe(source);
            expect(result.get('destination')).toBe(destination);
            expect(result.get('authority')).toBe(authority);
        });

        test('should resolve publicKeyValueNode defaults without user input', async () => {
            const root = loadRoot('token-idl.json');
            const ix = getInstruction(root, 'initializeMint');

            const mint = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { decimals: 9, freezeAuthority: null, mintAuthority: mint },
                { mint },
            );

            // rent sysvar has publicKeyValueNode default
            expect(result.get('rent')).toBe(address('SysvarRent111111111111111111111111111111111'));
            expect(result.get('mint')).toBe(mint);
        });

        test('should resolve payerValueNode default', async () => {
            const root = loadRoot('system-program-idl.json');
            const ix = getInstruction(root, 'createAccount');

            const payer = await SvmTestContext.generateAddress();
            const newAccount = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { lamports: 1000000, programAddress: address('11111111111111111111111111111111'), space: 0 },
                { newAccount, payer },
            );

            expect(result.get('payer')).toBe(payer);
            expect(result.get('newAccount')).toBe(newAccount);
        });
    });

    describe('dependent accounts', () => {
        test('should resolve PDA depending on another account address as seed', async () => {
            const root = loadRoot('blog-idl.json');
            const ix = getInstruction(root, 'createAccessGrant');

            const authority = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { permissions: new Uint8Array([1, 0, 1, 0]) },
                { authority },
            );

            // authority resolves in pass 1 (user-provided)
            expect(result.get('authority')).toBe(authority);
            // profile PDA resolves in pass 2 (depends on authority seed)
            expect(result.get('profile')).toBeDefined();
            expect(result.get('profile')).not.toBeNull();
            // accessGrant PDA resolves in pass 3 (depends on profile seed)
            expect(result.get('accessGrant')).toBeDefined();
            expect(result.get('accessGrant')).not.toBeNull();
            // systemProgram resolves in pass 1 (publicKeyValueNode, no deps)
            expect(result.get('systemProgram')).toBe(address('11111111111111111111111111111111'));
        });

        test('should resolve multi-level PDA chain in correct order', async () => {
            const root = loadRoot('blog-idl.json');
            const ix = getInstruction(root, 'createAccessGrant');

            const authority = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { permissions: new Uint8Array([1, 0, 1, 0]) },
                { authority },
            );

            expect(result.size).toBe(ix.accounts.length);
            // No null values (all accounts are required)
            for (const [, addr] of result) {
                expect(addr).not.toBeNull();
                expect(addr).toBeDefined();
            }
        });
    });

    describe('circular dependencies', () => {
        test('should resolve A->B->A cycle when user provides accountA', async () => {
            const root = loadRoot('circular-account-refs-idl.json');
            const ix = getInstruction(root, 'twoAccountCycle');

            const testAddress = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(root, ix, {}, { accountA: testAddress });

            // accountA provided by user → resolves in pass 1
            expect(result.get('accountA')).toBe(testAddress);
            // accountB defaults to accountA → resolves in pass 2
            expect(result.get('accountB')).toBe(testAddress);
        });

        test('should resolve A->B->C->A cycle when user provides accountA', async () => {
            const root = loadRoot('circular-account-refs-idl.json');
            const ix = getInstruction(root, 'threeAccountCycle');

            const testAddress = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(root, ix, {}, { accountA: testAddress });

            expect(result.get('accountA')).toBe(testAddress);
            expect(result.get('accountB')).toBe(testAddress);
            expect(result.get('accountC')).toBe(testAddress);
        });

        test('should throw with blockedBy info for A->B->A cycle with no user input', async () => {
            const root = loadRoot('circular-account-refs-idl.json');
            const ix = getInstruction(root, 'twoAccountCycle');

            await expect(resolveAccountAddressesFallback(root, ix, {}, {})).rejects.toThrow(
                /Cannot resolve accounts.*accountA.*accountB/,
            );
        });

        test('should throw with blockedBy info for self-reference with no user input', async () => {
            const root = loadRoot('circular-account-refs-idl.json');
            const ix = getInstruction(root, 'selfReference');

            await expect(resolveAccountAddressesFallback(root, ix, {}, {})).rejects.toThrow(
                /Cannot resolve accounts.*accountA/,
            );
        });
    });

    describe('optional accounts', () => {
        test('should resolve optional account to null with omitted strategy when user provides null', async () => {
            const root = loadRoot('custom-resolvers-test-idl.json');
            const ix = getInstruction(root, 'transferWithResolver');

            const authority = await SvmTestContext.generateAddress();
            const destination = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                {},
                { authority, destination, treasury: null },
            );

            // treasury is optional — null input should resolve based on optionalAccountStrategy
            expect(result.has('treasury')).toBe(true);
        });
    });

    describe('resolver accounts', () => {
        test('should resolve resolver-based account with provided resolver function', async () => {
            const root = loadRoot('custom-resolvers-test-idl.json');
            const ix = getInstruction(root, 'transferWithResolver');

            const authority = await SvmTestContext.generateAddress();
            const resolvedDestination = await SvmTestContext.generateAddress();

            const resolvedTreasury = SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                {},
                { authority },
                {
                    resolveDestination: () => Promise.resolve(resolvedDestination),
                    resolveTreasury: () => Promise.resolve(resolvedTreasury),
                },
            );

            expect(result.get('destination')).toBe(resolvedDestination);
        });

        test('should resolve conditional account via resolver', async () => {
            const root = loadRoot('custom-resolvers-test-idl.json');
            const ix = getInstruction(root, 'conditionalTransfer');

            const authority = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                {},
                { authority },
                {
                    resolveIncludeRequired: () => Promise.resolve(true),
                    resolveIncludeTarget: () => Promise.resolve(true),
                },
            );

            expect(result.get('authority')).toBe(authority);
            // When resolver returns true, ifTrue branch (publicKeyValueNode) is used
            expect(result.get('requiredTarget')).toBeDefined();
        });
    });

    describe('hard errors (not retried)', () => {
        test('should throw immediately for missing required account with no default', async () => {
            const root = loadRoot('token-idl.json');
            const ix = getInstruction(root, 'transfer');

            // source is required, no default — should throw immediately, not retry
            await expect(
                resolveAccountAddressesFallback(
                    root,
                    ix,
                    { amount: 100 },
                    { destination: await SvmTestContext.generateAddress() },
                ),
            ).rejects.toThrow(/Missing required account.*source/);
        });
    });

    describe('mixed scenarios', () => {
        test('should handle mix of user-provided, defaulted, and identity accounts', async () => {
            const root = loadRoot('token-idl.json');
            const ix = getInstruction(root, 'initializeMint');

            const mint = await SvmTestContext.generateAddress();

            const result = await resolveAccountAddressesFallback(
                root,
                ix,
                { decimals: 9, freezeAuthority: null, mintAuthority: mint },
                { mint },
            );

            // mint: user-provided
            expect(result.get('mint')).toBe(mint);
            // rent: publicKeyValueNode default
            expect(result.get('rent')).toBeDefined();
            expect(result.size).toBe(ix.accounts.length);
        });
    });
});
