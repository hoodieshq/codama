import { address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';

import type { AccountsInput, ArgumentsInput, BuildIxFn, EitherSigners, ResolversInput } from '../../shared/types';
import { createAccountMeta, validateAccountsInput } from './accounts';
import {
    encodeInstructionArguments,
    resolveArgumentDefaultsFromCustomResolvers,
    validateArgumentsInput,
} from './arguments';

/**
 * Creates an instruction builder for a given InstructionNode.
 */
export function createIxBuilder(root: RootNode, ixNode: InstructionNode): BuildIxFn {
    const programAddress = address(root.program.publicKey);

    return async (argumentsInput, accountsInput, signers, resolversInput) => {
        const { argumentsData, accountsData } = await resolveInstructionData(
            root,
            ixNode,
            argumentsInput,
            accountsInput,
            signers,
            resolversInput,
        );

        return {
            accounts: accountsData,
            data: argumentsData,
            programAddress,
        };
    };
}

export async function resolveInstructionData(
    root: RootNode,
    instructionNode: InstructionNode,
    argumentsInput?: ArgumentsInput,
    accountsInput?: AccountsInput,
    signers?: EitherSigners,
    resolversInput?: ResolversInput,
) {
    // Validate arguments according to Codama schema.
    validateArgumentsInput(root, instructionNode, argumentsInput);

    // Ensure required accounts are present and validate provided pubkey addresses.
    validateAccountsInput(instructionNode, accountsInput);

    // Resolve arguments that depend on custom resolvers.
    const enrichedArgumentsInput = await resolveArgumentDefaultsFromCustomResolvers(
        instructionNode,
        argumentsInput,
        accountsInput,
        resolversInput,
    );

    // Encode arguments into buffer.
    const argumentsData = encodeInstructionArguments(root, instructionNode, enrichedArgumentsInput);

    const accountsData = await createAccountMeta(
        root,
        instructionNode,
        enrichedArgumentsInput,
        accountsInput,
        signers,
        resolversInput,
    );

    return { accountsData, argumentsData };
}
