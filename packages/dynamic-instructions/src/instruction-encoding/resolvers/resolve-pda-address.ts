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
import { isNode, pdaLinkNode, visitOrElse } from 'codama';

import { AccountError } from '../../shared/errors';
import { createPdaSeedValueVisitor } from '../visitors/pda-seed-value';
import { getProgramFromCtx, type ResolutionContext } from './shared';

export type ResolvePDAAddressContext = ResolutionContext & {
    ixAccountNode: InstructionAccountNode;
    pdaValueNode: PdaValueNode;
};

/**
 * Derives a PDA from a PdaValueNode.
 * Encodes each seed (ConstantPdaSeedNode and VariablePdaSeedNode) into bytes and computes the address.
 */
export async function resolvePDAAddress(ctx: ResolvePDAAddressContext): Promise<ProgramDerivedAddress | null> {
    const { ixAccountNode, pdaValueNode } = ctx;
    const program = getProgramFromCtx(ctx);

    if (!isNode(pdaValueNode, 'pdaValueNode')) {
        throw new AccountError(`Account node ${ixAccountNode.name} is not a PDA`);
    }

    const pdaNode = resolvePdaNode(ctx, pdaValueNode);
    const programId = address(pdaNode.programId || program.publicKey);

    const seedValues = await Promise.all(
        pdaNode.seeds.map(async seedNode => {
            if (seedNode.kind === 'constantPdaSeedNode') {
                return await resolveConstantPdaSeed(ctx, programId, seedNode);
            }

            if (seedNode.kind === 'variablePdaSeedNode') {
                const variableSeedValueNodes = pdaValueNode.seeds;
                const seedName = seedNode.name;
                const variableSeedValueNode = variableSeedValueNodes.find(node => node.name === seedName);

                if (!variableSeedValueNode) {
                    throw new AccountError(
                        `PDA Node ${pdaNode.name}. Variable PDA SeedValueNode ${seedName} was not found for ${ixAccountNode.name} account`,
                    );
                }

                return await resolveVariablePdaSeed(ctx, programId, seedNode, variableSeedValueNode);
            }

            throw new AccountError(
                `PDA node: ${pdaNode.name}. Unsupported seed kind ${(seedNode as { kind?: string }).kind}`,
            );
        }),
    );

    return await getProgramDerivedAddress({
        programAddress: programId,
        seeds: seedValues,
    });
}

function resolvePdaNode(ctx: ResolutionContext, pdaDefaultValue: PdaValueNode): PdaNode {
    if (isNode(pdaDefaultValue.pda, 'pdaLinkNode')) {
        const linkedPda = ctx.linkables.get([...ctx.stack.getPath(), pdaLinkNode(pdaDefaultValue.pda.name)]);
        if (!linkedPda) {
            throw new AccountError(`Linked PDA node not found: ${pdaDefaultValue.pda.name}`);
        }
        return linkedPda;
    }

    if (isNode(pdaDefaultValue.pda, 'pdaNode')) {
        return pdaDefaultValue.pda;
    }

    throw new AccountError(`Unsupported PDA node kind: ${(pdaDefaultValue.pda as { kind: string }).kind}`);
}

function resolveVariablePdaSeed(
    ctx: ResolutionContext,
    programId: Address,
    seedNode: VariablePdaSeedNode,
    variableSeedValueNode: PdaSeedValueNode,
): Promise<ReadonlyUint8Array> {
    if (!isNode(variableSeedValueNode, 'pdaSeedValueNode')) {
        throw new AccountError(`Not a PDA seed value node: ${(variableSeedValueNode as { kind?: string }).kind}`);
    }

    if (seedNode.name !== variableSeedValueNode.name) {
        throw new AccountError(`Mismatched PDA seed: ${seedNode.name} vs ${variableSeedValueNode.name}`);
    }

    const visitor = createPdaSeedValueVisitor({
        ...ctx,
        programId,
        seedTypeNode: seedNode.type,
    });

    return visitOrElse(variableSeedValueNode.value, visitor, node => {
        throw new AccountError(`Unsupported variable PDA seed value node: ${node.kind}`);
    });
}

function resolveConstantPdaSeed(
    ctx: ResolutionContext,
    programId: Address,
    seedNode: RegisteredPdaSeedNode,
): Promise<ReadonlyUint8Array> {
    if (!isNode(seedNode, 'constantPdaSeedNode')) {
        throw new AccountError(`Not a constant PDA seed node: ${seedNode.kind}`);
    }

    const visitor = createPdaSeedValueVisitor({
        ...ctx,
        programId,
    });
    return visitOrElse(seedNode.value, visitor, node => {
        throw new AccountError(`Unsupported constant PDA seed value node: ${node.kind}`);
    });
}
