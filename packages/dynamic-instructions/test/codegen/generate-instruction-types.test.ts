import {
    camelCase,
    instructionAccountNode,
    instructionArgumentNode,
    instructionNode,
    instructionRemainingAccountsNode,
    programNode,
    rootNode,
} from 'codama';
import { describe, expect, test } from 'vitest';

import { generateInstructionTypes } from '../../src/cli/commands/generate-instruction-types/generate-instruction-types';

function makeRoot(instructions: ReturnType<typeof instructionNode>[], name = 'testProgram') {
    return rootNode(
        programNode({
            instructions,
            name,
            publicKey: '11111111111111111111111111111111',
        }),
    );
}

describe('generateInstructionTypes', () => {
    test('should generate Args type with correct TS types', () => {
        const root = makeRoot([
            instructionNode({
                arguments: [
                    instructionArgumentNode({
                        name: 'amount',
                        type: { endian: 'le', format: 'u64', kind: 'numberTypeNode' },
                    }),
                    instructionArgumentNode({
                        name: 'memo',
                        type: { encoding: 'utf8', kind: 'stringTypeNode' },
                    }),
                ],
                name: 'transfer',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type TransferArgs = {');
        expect(output).toContain('    amount: number | bigint;');
        expect(output).toContain('    memo: string;');
    });

    test('should filter omitted arguments from Args type', () => {
        const root = makeRoot([
            instructionNode({
                arguments: [
                    instructionArgumentNode({
                        name: 'visible',
                        type: { endian: 'le', format: 'u8', kind: 'numberTypeNode' },
                    }),
                    instructionArgumentNode({
                        defaultValue: { kind: 'numberValueNode', number: 0 },
                        defaultValueStrategy: 'omitted',
                        name: 'hidden',
                        type: { endian: 'le', format: 'u8', kind: 'numberTypeNode' },
                    }),
                ],
                name: 'init',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('visible: number;');
        expect(output).not.toContain('hidden');
    });

    test('should handle instructions with no arguments (void)', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({
                        isSigner: true,
                        isWritable: false,
                        name: 'authority',
                    }),
                ],
                name: 'noArgs',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).not.toContain('NoArgsArgs');
        // The map should use void for args
        expect(output).toContain('noArgs: InstructionsBuilderFn<void');
    });

    test('should generate Accounts type with optional (?) for auto-resolvable accounts', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({
                        defaultValue: { kind: 'payerValueNode' },
                        isSigner: true,
                        isWritable: true,
                        name: 'payer',
                    }),
                    instructionAccountNode({
                        defaultValue: {
                            kind: 'publicKeyValueNode',
                            publicKey: '11111111111111111111111111111111',
                        },
                        isSigner: false,
                        isWritable: false,
                        name: 'systemProgram',
                    }),
                    instructionAccountNode({
                        isSigner: false,
                        isWritable: true,
                        name: 'target',
                    }),
                ],
                name: 'create',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type CreateAccounts = {');
        // payer has payerValueNode — NOT auto-resolvable, hence no ?
        expect(output).toContain('    payer: Address;');
        // systemProgram has publicKeyValueNode — auto-resolvable, hence ?
        expect(output).toContain('    systemProgram?: Address;');
        // target has no default — not auto-resolvable, hence no ?
        expect(output).toContain('    target: Address;');
    });

    test('should generate Accounts type with | null for optional accounts', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({
                        isOptional: true,
                        isSigner: false,
                        isWritable: false,
                        name: 'closeAuthority',
                    }),
                ],
                name: 'maybeClose',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('    closeAuthority: Address | null;');
    });

    test('should generate Signers type when isSigner: "either" exists', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({
                        isSigner: 'either',
                        isWritable: false,
                        name: 'authority',
                    }),
                    instructionAccountNode({
                        isSigner: false,
                        isWritable: true,
                        name: 'source',
                    }),
                ],
                name: 'transfer',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain("export type TransferSigners = ('authority')[];");
    });

    test('should generate Resolvers type when resolverValueNode exists', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({
                        isSigner: true,
                        isWritable: false,
                        name: 'authority',
                    }),
                ],
                arguments: [
                    instructionArgumentNode({
                        defaultValue: {
                            kind: 'resolverValueNode',
                            name: camelCase('computeValue'),
                        },
                        name: 'computedValue',
                        type: { endian: 'le', format: 'u64', kind: 'numberTypeNode' },
                    }),
                ],
                name: 'customResolve',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type CustomResolveResolvers = {');
        expect(output).toContain('    computeValue: ResolverFn<CustomResolveArgs, CustomResolveAccounts>;');
    });

    test('should generate InstructionBuilders aggregate map type', () => {
        const root = makeRoot(
            [
                instructionNode({
                    accounts: [
                        instructionAccountNode({
                            isSigner: false,
                            isWritable: true,
                            name: 'source',
                        }),
                    ],
                    arguments: [
                        instructionArgumentNode({
                            name: 'amount',
                            type: { endian: 'le', format: 'u64', kind: 'numberTypeNode' },
                        }),
                    ],
                    name: 'transfer',
                }),
                instructionNode({ name: 'close' }),
            ],
            'token',
        );
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type TokenInstructionBuilders = {');
        expect(output).toContain('    transfer: InstructionsBuilderFn<TransferArgs, TransferAccounts');
        expect(output).toContain('    close: InstructionsBuilderFn<void');
    });

    test('should mark optional type arguments with ?', () => {
        const root = makeRoot([
            instructionNode({
                arguments: [
                    instructionArgumentNode({
                        name: 'maybeValue',
                        type: {
                            item: { endian: 'le', format: 'u32', kind: 'numberTypeNode' },
                            kind: 'optionTypeNode',
                            prefix: { endian: 'le', format: 'u8', kind: 'numberTypeNode' },
                        },
                    }),
                ],
                name: 'optionalArgs',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('    maybeValue?: number | null;');
    });

    test('should generate remaining account arguments in Args type', () => {
        const root = makeRoot([
            instructionNode({
                name: 'multiSig',
                remainingAccounts: [
                    instructionRemainingAccountsNode(
                        { kind: 'argumentValueNode', name: camelCase('multiSigners') },
                        { isSigner: true, isWritable: false },
                    ),
                ],
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type MultiSigArgs = {');
        expect(output).toContain('    multiSigners: Address[];');
    });

    test('should handle empty accounts list', () => {
        const root = makeRoot([instructionNode({ name: 'noAccounts' })]);
        const output = generateInstructionTypes(root);
        expect(output).toContain('export type NoAccountsAccounts = Record<string, Address | null | undefined>;');
    });
});
