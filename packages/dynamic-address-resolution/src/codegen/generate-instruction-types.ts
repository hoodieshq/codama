import { type DefinedTypeNode, type InstructionNode, pascalCase, type RootNode } from 'codama';

import { OPTIONAL_NODE_KINDS } from '../shared/nodes';
import { codamaTypeToTS } from './codama-type-to-ts';
import { collectResolverNames } from './collect-resolver-names';
import { isAccountAutoResolvable } from './is-account-auto-resolvable';

/**
 * Generate per-instruction `${Name}Args`, `${Name}Accounts`, and `${Name}Resolvers`
 * type aliases.
 */
export function generateInstructionTypes(idl: RootNode): string {
    const definedTypes = idl.program.definedTypes ?? [];
    let output = '';
    for (const ix of idl.program.instructions) {
        output += generateInstructionTypeBlock(ix, definedTypes);
    }
    return output;
}

function generateInstructionTypeBlock(ix: InstructionNode, definedTypes: DefinedTypeNode[]): string {
    let output = '';
    const typeName = pascalCase(ix.name);

    // Build args type
    const args = ix.arguments.filter(arg => arg.defaultValueStrategy !== 'omitted');
    const remainingAccountArgs = (ix.remainingAccounts ?? []).filter(ra => ra.value.kind === 'argumentValueNode');
    let argsRef = 'void';
    if (args.length > 0 || remainingAccountArgs.length > 0) {
        const argsInterfaceName = `${typeName}Args`;
        output += `export type ${argsInterfaceName} = {\n`;
        for (const arg of args) {
            const tsType = codamaTypeToTS(arg.type, definedTypes);
            const isOptional = OPTIONAL_NODE_KINDS.includes(arg.type.kind);
            const sep = isOptional ? '?:' : ':';
            output += `    ${arg.name}${sep} ${tsType};\n`;
        }
        for (const ra of remainingAccountArgs) {
            const sep = ra.isOptional ? '?:' : ':';
            output += `    ${ra.value.name}${sep} Address[];\n`;
        }
        output += '};\n\n';
        argsRef = argsInterfaceName;
    }

    // Build accounts type
    const accountsInterfaceName = `${typeName}Accounts`;
    if (ix.accounts.length > 0) {
        output += `export type ${accountsInterfaceName} = {\n`;
        for (const acc of ix.accounts) {
            const omittable = isAccountAutoResolvable(acc) ? '?' : '';
            const type = acc.isOptional ? 'Address | null' : 'Address';
            output += `    ${acc.name}${omittable}: ${type};\n`;
        }
        output += '} & Record<string, Address | null | undefined>;\n\n';
    } else {
        output += `export type ${accountsInterfaceName} = Record<string, Address | null | undefined>;\n\n`;
    }

    // Resolvers type (only when resolverValueNode exists)
    const resolverNames = collectResolverNames(ix);
    if (resolverNames.size > 0) {
        const resolversTypeName = `${typeName}Resolvers`;
        output += `export type ${resolversTypeName} = {\n`;
        for (const name of resolverNames) {
            output += `    ${name}: ResolverFn<${argsRef === 'void' ? 'Record<string, unknown>' : argsRef}, ${accountsInterfaceName}>;\n`;
        }
        output += '};\n\n';
    }

    return output;
}
