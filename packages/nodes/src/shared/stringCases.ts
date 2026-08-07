import type {
    CamelCaseString,
    KebabCaseString,
    PascalCaseString,
    SnakeCaseString,
    TitleCaseString,
} from '@codama/node-types';

/**
 * Uppercase the first character and lowercase the rest. Returns the input unchanged when it is empty.
 *
 * @example
 * ```ts
 * capitalize('hello WORLD'); // 'Hello world'
 * ```
 */
export function capitalize(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Normalise an arbitrary string into Title Case, a space-separated sequence of capitalized words.
 * Inserts a space before each uppercase letter, splits on any run of non-alphanumeric characters and rejoins.
 *
 * @example
 * ```ts
 * titleCase('my-cool_string'); // 'My Cool String'
 * ```
 */
export function titleCase(str: string): TitleCaseString {
    if (/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/.test(str)) {
        return str.toLowerCase().split('_').map(capitalize).join(' ') as TitleCaseString;
    }
    return str
        .replace(/([A-Z])/g, ' $1')
        .split(/[^a-zA-Z0-9]+/)
        .filter(word => word.length > 0)
        .map(capitalize)
        .join(' ') as TitleCaseString;
}

/**
 * Normalise an arbitrary string into PascalCase by stripping the spaces from its Title Case form.
 *
 * @example
 * ```ts
 * pascalCase('my-cool_string'); // 'MyCoolString'
 * ```
 */
export function pascalCase(str: string): PascalCaseString {
    return titleCase(str).split(' ').join('') as PascalCaseString;
}

/**
 * Normalise an arbitrary string into camelCase by lowercasing the first character of its PascalCase form.
 *
 * @example
 * ```ts
 * camelCase('my-cool_string'); // 'myCoolString'
 * ```
 */
export function camelCase(str: string): CamelCaseString {
    if (str.length === 0) return str as CamelCaseString;
    const pascalStr = pascalCase(str);
    return (pascalStr.charAt(0).toLowerCase() + pascalStr.slice(1)) as CamelCaseString;
}

/**
 * Normalise an arbitrary string into kebab-case, lowercase words joined with `-`, from its Title Case form.
 *
 * @example
 * ```ts
 * kebabCase('MyCoolString'); // 'my-cool-string'
 * ```
 */
export function kebabCase(str: string): KebabCaseString {
    return titleCase(str).split(' ').join('-').toLowerCase() as KebabCaseString;
}

/**
 * Normalise an arbitrary string into snake_case, lowercase words joined with `_`, from its Title Case form.
 *
 * @example
 * ```ts
 * snakeCase('MyCoolString'); // 'my_cool_string'
 * ```
 */
export function snakeCase(str: string): SnakeCaseString {
    return titleCase(str).split(' ').join('_').toLowerCase() as SnakeCaseString;
}
