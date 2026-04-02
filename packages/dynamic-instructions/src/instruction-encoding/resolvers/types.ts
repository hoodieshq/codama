import type { Address } from '@solana/addresses';
import type { InstructionNode, LinkableDictionary, RootNode } from 'codama';

import type { AccountsInput, ArgumentsInput, ResolversInput } from '../../shared/types';

/**
 * Shared context threaded through the account/PDA resolution pipeline.
 * Individual resolvers/visitors extend this with domain-specific fields.
 */
export type BaseResolutionContext = {
    accountsInput: AccountsInput | undefined;
    argumentsInput: ArgumentsInput | undefined;
    ixNode: InstructionNode;
    linkables: LinkableDictionary;
    resolvedAddresses: ReadonlyMap<string, Address | null>;
    resolversInput: ResolversInput | undefined;
    root: RootNode;
};
