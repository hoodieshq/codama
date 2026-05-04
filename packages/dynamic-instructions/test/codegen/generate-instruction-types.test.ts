import { instructionAccountNode, instructionArgumentNode, instructionNode, programNode, rootNode } from 'codama';
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
    test('should generate Signers type when isSigner: "either" exists', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [
                    instructionAccountNode({ isSigner: 'either', isWritable: false, name: 'authority' }),
                    instructionAccountNode({ isSigner: false, isWritable: true, name: 'source' }),
                ],
                name: 'transfer',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).toContain("export type TransferSigners = ('authority')[];");
    });

    test('should not generate Signers block when there are no isSigner: "either" accounts', () => {
        const root = makeRoot([
            instructionNode({
                accounts: [instructionAccountNode({ isSigner: true, isWritable: true, name: 'payer' })],
                name: 'noEither',
            }),
        ]);
        const output = generateInstructionTypes(root);
        expect(output).not.toContain('NoEitherSigners');
    });

    test('should generate InstructionBuilders aggregate map type', () => {
        const root = makeRoot(
            [
                instructionNode({
                    accounts: [instructionAccountNode({ isSigner: false, isWritable: true, name: 'source' })],
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
});
