import { pascalCase, type RootNode } from 'codama';

import { codamaTypeToTS } from './codama-type-to-ts';
import { collectPdaNodesFromIdl } from './collect-pda-nodes';

/**
 * Generate `${Pda}PdaSeeds` types and the aggregate `${Program}Pdas` map type.
 *
 * Returns the type block with the aggregate map type name. `mapTypeName` is `null` when the program has no PDAs.
 */
export function generatePdaTypes(idl: RootNode): { mapTypeName: string | null; typeBlock: string } {
    const programName = pascalCase(idl.program.name);
    const definedTypes = idl.program.definedTypes ?? [];
    const pdaMap = collectPdaNodesFromIdl(idl);

    if (pdaMap.size === 0) {
        return { mapTypeName: null, typeBlock: '' };
    }

    let output = '';

    for (const [pdaName, pdaNode] of pdaMap) {
        const typeName = pascalCase(pdaName);
        const variableSeeds = (pdaNode.seeds ?? []).filter(s => s.kind === 'variablePdaSeedNode');
        if (variableSeeds.length > 0) {
            output += `export type ${typeName}PdaSeeds = {\n`;
            for (const seed of variableSeeds) {
                const tsType = seed.type ? codamaTypeToTS(seed.type, definedTypes) : 'unknown';
                output += `    ${seed.name}: ${tsType};\n`;
            }
            output += '};\n\n';
        }
    }

    const mapTypeName = `${programName}Pdas`;
    output += `/**\n * Strongly-typed PDAs for ${programName}.\n */\n`;
    output += `export type ${mapTypeName} = {\n`;
    for (const [pdaName, pdaNode] of pdaMap) {
        const typeName = pascalCase(pdaName);
        const variableSeeds = (pdaNode.seeds ?? []).filter(s => s.kind === 'variablePdaSeedNode');
        const seedsParam = variableSeeds.length > 0 ? `seeds: ${typeName}PdaSeeds` : `seeds?: Record<string, unknown>`;
        output += `    ${pdaName}: (${seedsParam}) => Promise<ProgramDerivedAddress>;\n`;
    }
    output += '};\n\n';

    return { mapTypeName, typeBlock: output };
}
