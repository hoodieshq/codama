import { collectResolverNames } from '@codama/dynamic-address-resolution/codegen';
import { pascalCase, type RootNode } from 'codama';

/**
 * Generate the `${Program}InstructionBuilders` aggregate map type.
 * Keys each instruction name to its `InstructionsBuilderFn` signature.
 */
export function generateInstructionBuildersMap(idl: RootNode): string {
    const programName = pascalCase(idl.program.name);
    let output = `/**
 * Strongly-typed instruction builders for ${programName}.
 */
export type ${programName}InstructionBuilders = {\n`;

    for (const ix of idl.program.instructions) {
        const typeName = pascalCase(ix.name);
        const eitherSignerAccounts = ix.accounts.filter(acc => acc.isSigner === 'either');
        const resolverNames = collectResolverNames(ix);

        const signersGeneric = eitherSignerAccounts.length > 0 ? `${typeName}Signers` : 'string[]';
        const args = ix.arguments.filter(arg => arg.defaultValueStrategy !== 'omitted');
        const remainingAccountArgs = (ix.remainingAccounts ?? []).filter(ra => ra.value.kind === 'argumentValueNode');
        const hasArgs = args.length > 0 || remainingAccountArgs.length > 0;
        const argsGeneric = hasArgs ? `${typeName}Args` : 'void';
        const accountsGeneric = `${typeName}Accounts`;
        const resolversGeneric = resolverNames.size > 0 ? `, ${typeName}Resolvers` : '';

        output += `    ${ix.name}: InstructionsBuilderFn<${argsGeneric}, ${accountsGeneric}, ${signersGeneric}${resolversGeneric}>;\n`;
    }

    output += '};\n';
    return output;
}
