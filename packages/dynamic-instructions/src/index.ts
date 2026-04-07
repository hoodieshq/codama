export type { ProgramDerivedAddress } from '@solana/addresses';

export { isPublicKeyLike, toAddress } from './shared/address';
export type { AddressInput, PublicKeyLike } from './shared/address';

export { CodamaError, isCodamaError } from '@codama/errors';
export {
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__NODE_REFERENCE_NOT_FOUND,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__ACCOUNT_RESOLVER_MISSING,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__CANNOT_CONVERT_TO_ADDRESS,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__CIRCULAR_ACCOUNT_DEPENDENCY,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EVALUATE_CONDITIONAL,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_ENCODE_ARGUMENT,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INSTRUCTION_NOT_FOUND,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ARGUMENT_INPUT,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_PDA_SEED,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__PDA_NOT_FOUND,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__FAILED_TO_EXECUTE_RESOLVER,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE,
} from '@codama/errors';

export type { AccountsInput, ArgumentsInput } from './shared/types';

export { createProgramClient } from './program-client/create-program-client';
export type {
    CreateProgramClientOptions,
    IdlInput,
    ProgramClient,
    ProgramMethodBuilder,
} from './program-client/create-program-client';

export { generateClientTypes } from './cli/commands/generate-client-types/generate-client-types';
