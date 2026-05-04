import type { Command } from 'commander';

import { generateInstructionTypesFromFile } from './generate-instruction-types-from-file';

export function registerGenerateInstructionTypesCommand(program: Command): void {
    program
        .command('generate-instruction-types')
        .description('Generate TypeScript instruction types from a Codama IDL JSON file')
        .argument('<codama-idl>', 'Path to a Codama IDL JSON file (e.g., ./idl/codama.json)')
        .argument('<output-dir>', 'Path to the output directory for the generated .ts file, e.g., ./generated')
        .action((idlArg: string, outputDirArg: string) => {
            generateInstructionTypesFromFile(idlArg, outputDirArg);
        });
}
