import { address } from '@solana/addresses';
import type { InstructionNode, RootNode } from 'codama';

import { createAccountMeta, createAccountsInputValidator } from './accounts';
import {
    createArgumentsInputValidator,
    encodeInstructionArguments,
    resolveArgumentDefaultsFromCustomResolvers,
} from './arguments';
import type {
    AccountsInput,
    ArgumentsInput,
    EitherSigners,
    InstructionsBuilderFn,
    ResolverFn,
    ResolversInput,
} from './shared/types';

/**
 * Creates an async instruction builder function for a given `InstructionNode`.
 *
 * The returned function validates arguments and accounts against the Codama schema,
 * resolves custom resolver defaults, encodes arguments into a data buffer,
 * and assembles the final `Instruction` with account metas and program address.
 *
 * @example
 * ```ts
 * const build = createInstructionsBuilder(root, ixNode);
 * const instruction = await build(args, accounts, signers, resolvers);
 * ```
 */
export function createInstructionsBuilder<
    TArgs extends ArgumentsInput = ArgumentsInput,
    TAccounts extends AccountsInput = AccountsInput,
    TSigners extends EitherSigners = EitherSigners,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ResolverFn<any, any> avoids contravariance issue.
    TResolvers extends Record<string, ResolverFn<any, any>> = ResolversInput,
>(root: RootNode, ixNode: InstructionNode): InstructionsBuilderFn<TArgs, TAccounts, TSigners, TResolvers> {
    const programAddress = address(root.program.publicKey);
    const validateArguments = createArgumentsInputValidator(root, ixNode);
    const validateAccounts = createAccountsInputValidator(ixNode);

    return async (argumentsInput, accountsInput, signers, resolversInput) => {
        // Validate arguments according to Codama schema.
        validateArguments(argumentsInput);

        // Ensure required accounts are present and validate provided pubkey addresses.
        validateAccounts(accountsInput);

        // Resolve arguments that depend on custom resolvers.
        const enrichedArgumentsInput = await resolveArgumentDefaultsFromCustomResolvers(
            ixNode,
            argumentsInput,
            accountsInput,
            resolversInput,
        );

        // Encode arguments into buffer.
        const argumentsData = encodeInstructionArguments(root, ixNode, enrichedArgumentsInput);

        const accountsData = await createAccountMeta(
            root,
            ixNode,
            enrichedArgumentsInput,
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
