import type { Instruction } from '@solana/instructions';

import type { AddressInput } from './address';

// Note: optional accounts may be explicitly set to null.
export type AccountsInput = Partial<Record<string, AddressInput | null>>;
export type ArgumentsInput = Partial<Record<string, unknown>>;
type AccountName = string;
export type EitherSigners = AccountName[];

export type ResolverFn<TArgs = ArgumentsInput, TAccounts = AccountsInput> = (
    argumentsInput: TArgs,
    accountsInput: TAccounts,
) => Promise<unknown>;
export type ResolversInput = Record<string, ResolverFn>;

export type InstructionsBuilderFn<
    TArgs extends ArgumentsInput = ArgumentsInput,
    TAccounts extends AccountsInput = AccountsInput,
    TSigners extends EitherSigners = EitherSigners,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TResolvers constraint uses ResolverFn<any, any> to avoid contravariance issue — narrowed ResolverFn<SpecificArgs, SpecificAccounts> would not satisfy Record<string, ResolverFn>
    TResolvers extends Record<string, ResolverFn<any, any>> = ResolversInput,
> = (
    /** Instruction argument values (e.g. `{ amount: 1_000_000_000 }`). */
    argumentsInput?: TArgs,
    /** Account addresses keyed by name  (e.g. `{ payer: '111..' }`). */
    accountsInput?: TAccounts,
    /** Account names to mark as signers when the account has ambiguous `isSigner: 'either'`. */
    signers?: TSigners,
    /** Custom resolver functions for arguments with `ResolverValueNode`. */
    resolversInput?: TResolvers,
) => Promise<Instruction>;
