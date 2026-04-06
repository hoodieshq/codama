import {
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT,
    CodamaError,
} from '@codama/errors';
import { camelCase, type InstructionNode } from 'codama';
import { assert, StructError } from 'superstruct';

import type { AccountsInput } from '../../shared/types';
import { safeStringify } from '../../shared/util';
import { createIxAccountsValidator } from '../validators';

/**
 * Creates a validation function for InstructionAccountNodes.
 * Pre-built superstruct validator ensures all required accounts are provided and have valid addresses.
 * Skips validation for instructions without accounts.
 */
export function createAccountsInputValidator(ixNode: InstructionNode) {
    const validator = ixNode.accounts.length ? createIxAccountsValidator(ixNode.accounts) : null;

    return (accountsInput: AccountsInput = {}) => {
        if (!validator) return;

        try {
            assert(accountsInput, validator);
        } catch (error) {
            if (error instanceof StructError) {
                const key = error.key as string;
                const value = error.value as unknown;
                if (value == null) {
                    throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__MISSING_REQUIRED_ACCOUNT, {
                        accountName: camelCase(key),
                        instructionName: ixNode.name,
                    });
                } else {
                    throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                        details: safeStringify(value),
                        name: key,
                    });
                }
            }
            throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_ACCOUNT_ADDRESS, {
                cause: error,
                details: 'Unexpected account validation error',
                name: 'unknown',
            });
        }
    };
}
