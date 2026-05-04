import type { Command } from 'commander';

import { registerGenerateInstructionTypesCommand } from './generate-instruction-types/register-command';

export function registerCommands(program: Command): void {
    registerGenerateInstructionTypesCommand(program);
}
