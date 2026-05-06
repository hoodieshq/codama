import { type InstructionNode, pascalCase, type RootNode } from 'codama';

/**
 * Generate the per-instruction `${Name}Signers` type alias for instructions with `isSigner: 'either'` accounts.
 */
export function generateSignerTypes(idl: RootNode): string {
    let output = '';
    for (const ix of idl.program.instructions) {
        output += generateSignersTypeBlock(ix);
    }
    return output;
}

function generateSignersTypeBlock(ix: InstructionNode): string {
    const eitherSignerAccounts = ix.accounts.filter(acc => acc.isSigner === 'either').map(acc => `'${acc.name}'`);
    if (eitherSignerAccounts.length === 0) return '';
    const typeName = pascalCase(ix.name);
    return `export type ${typeName}Signers = (${eitherSignerAccounts.join(' | ')})[];\n\n`;
}
