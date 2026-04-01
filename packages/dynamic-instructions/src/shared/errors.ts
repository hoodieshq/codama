export class DynamicInstructionsError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'DynamicInstructionsError';
    }
}

export class ValidationError extends DynamicInstructionsError {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'ValidationError';
    }
}

export class AccountError extends DynamicInstructionsError {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'AccountError';
    }
}

export class DependencyNotResolvedError extends AccountError {
    readonly dependencyName: string;
    constructor(dependencyName: string, instructionName: string) {
        super(`Account "${dependencyName}" has not been resolved yet in instruction "${instructionName}"`);
        this.name = 'DependencyNotResolvedError';
        this.dependencyName = dependencyName;
    }
}

export class ArgumentError extends DynamicInstructionsError {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'ArgumentError';
    }
}

export class ResolverError extends DynamicInstructionsError {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'ResolverError';
    }
}
