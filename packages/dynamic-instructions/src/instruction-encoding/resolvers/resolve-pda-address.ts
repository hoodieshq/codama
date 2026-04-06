import {
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_PDA_SEED,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__LINKED_PDA_NOT_FOUND,
    CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE,
    CodamaError,
} from '@codama/errors';
import type { Address, ProgramDerivedAddress } from '@solana/addresses';
import { address, getProgramDerivedAddress } from '@solana/addresses';
import type { ReadonlyUint8Array } from '@solana/codecs';
import type {
    InstructionAccountNode,
    PdaNode,
    PdaSeedValueNode,
    PdaValueNode,
    RegisteredPdaSeedNode,
    VariablePdaSeedNode,
} from 'codama';
import { isNode, visitOrElse } from 'codama';

import { createPdaSeedValueVisitor } from '../visitors/pda-seed-value';
import type { BaseResolutionContext } from './types';

export type ResolvePDAAddressContext = BaseResolutionContext & {
    ixAccountNode: InstructionAccountNode;
    pdaValueNode: PdaValueNode;
};

/**
 * Derives a PDA from a PdaValueNode.
 * Encodes each seed (ConstantPdaSeedNode and VariablePdaSeedNode) into bytes and computes the address.
 */
export async function resolvePDAAddress({
    root,
    ixNode,
    ixAccountNode,
    argumentsInput = {},
    accountsInput = {},
    pdaValueNode,
    resolutionPath,
    resolversInput,
}: ResolvePDAAddressContext): Promise<ProgramDerivedAddress | null> {
    if (!isNode(pdaValueNode, 'pdaValueNode')) {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
            context: 'PDA address resolution',
            nodeKind: `${ixAccountNode.name} is not a pdaValueNode`,
        });
    }

    const pdaNode = resolvePdaNode(pdaValueNode, root.program.pdas);
    const programId = address(pdaNode.programId || root.program.publicKey);

    const seedValues = await Promise.all(
        pdaNode.seeds.map(async seedNode => {
            if (seedNode.kind === 'constantPdaSeedNode') {
                return await resolveConstantPdaSeed({
                    accountsInput,
                    argumentsInput,
                    ixNode,
                    programId,
                    resolutionPath,
                    resolversInput,
                    root,
                    seedNode,
                });
            }

            if (seedNode.kind === 'variablePdaSeedNode') {
                const variableSeedValueNodes = pdaValueNode.seeds;
                const seedName = seedNode.name;
                const variableSeedValueNode = variableSeedValueNodes.find(node => node.name === seedName);

                if (!variableSeedValueNode) {
                    throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_PDA_SEED, {
                        details: `Variable PDA SeedValueNode was not found for ${ixAccountNode.name} account`,
                        pdaName: pdaNode.name,
                        seedName,
                    });
                }

                return await resolveVariablePdaSeed({
                    accountsInput,
                    argumentsInput,
                    ixNode,
                    programId,
                    resolutionPath,
                    resolversInput,
                    root,
                    seedNode,
                    variableSeedValueNode,
                });
            }

            throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
                context: 'PDA address resolution',
                nodeKind: (seedNode as { kind?: string }).kind ?? 'unknown',
            });
        }),
    );

    return await getProgramDerivedAddress({
        programAddress: programId,
        seeds: seedValues,
    });
}

function resolvePdaNode(pdaDefaultValue: PdaValueNode, pdas: PdaNode[]): PdaNode {
    if (isNode(pdaDefaultValue.pda, 'pdaLinkNode')) {
        const linkedPda = pdas.find(p => p.name === pdaDefaultValue.pda.name);
        if (!linkedPda) {
            throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__LINKED_PDA_NOT_FOUND, {
                pdaName: pdaDefaultValue.pda.name,
            });
        }
        return linkedPda;
    }

    if (isNode(pdaDefaultValue.pda, 'pdaNode')) {
        return pdaDefaultValue.pda;
    }

    throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
        context: 'PDA address resolution',
        nodeKind: (pdaDefaultValue.pda as { kind: string }).kind,
    });
}

type ResolvePdaSeedContext = BaseResolutionContext & {
    programId: Address;
    seedNode: VariablePdaSeedNode;
    variableSeedValueNode: PdaSeedValueNode;
};
function resolveVariablePdaSeed({
    accountsInput = {},
    argumentsInput = {},
    ixNode,
    programId,
    resolutionPath,
    resolversInput,
    root,
    seedNode,
    variableSeedValueNode,
}: ResolvePdaSeedContext): Promise<ReadonlyUint8Array> {
    if (!isNode(variableSeedValueNode, 'pdaSeedValueNode')) {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_PDA_SEED, {
            details: `Not a PDA seed value node: ${(variableSeedValueNode as { kind?: string }).kind}`,
            pdaName: seedNode.name,
            seedName: seedNode.name,
        });
    }

    if (seedNode.name !== variableSeedValueNode.name) {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__INVALID_PDA_SEED, {
            details: `Mismatched PDA seed: ${seedNode.name} vs ${variableSeedValueNode.name}`,
            pdaName: seedNode.name,
            seedName: seedNode.name,
        });
    }

    const visitor = createPdaSeedValueVisitor({
        accountsInput,
        argumentsInput,
        ixNode,
        programId,
        resolutionPath,
        resolversInput,
        root,
        seedTypeNode: seedNode.type,
    });

    return visitOrElse(variableSeedValueNode.value, visitor, node => {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
            context: 'PDA address resolution',
            nodeKind: node.kind,
        });
    });
}

type ResolveConstantPdaSeedContext = BaseResolutionContext & {
    programId: Address;
    seedNode: RegisteredPdaSeedNode;
};
function resolveConstantPdaSeed({
    accountsInput,
    argumentsInput,
    ixNode,
    programId,
    resolutionPath,
    resolversInput,
    root,
    seedNode,
}: ResolveConstantPdaSeedContext): Promise<ReadonlyUint8Array> {
    if (!isNode(seedNode, 'constantPdaSeedNode')) {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
            context: 'PDA address resolution',
            nodeKind: seedNode.kind,
        });
    }

    const visitor = createPdaSeedValueVisitor({
        accountsInput,
        argumentsInput,
        ixNode,
        programId,
        resolutionPath,
        resolversInput,
        root,
    });
    return visitOrElse(seedNode.value, visitor, node => {
        throw new CodamaError(CODAMA_ERROR__DYNAMIC_INSTRUCTIONS__UNSUPPORTED_NODE, {
            context: 'PDA address resolution',
            nodeKind: node.kind,
        });
    });
}
