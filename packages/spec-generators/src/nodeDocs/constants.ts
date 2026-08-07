import type { EntityKind } from './pages';

/** Documentation file extension. */
export const DOC_EXT = 'md';

/** Blank line between two markdown blocks, used to join rendered sections. */
export const BLOCK_SEPARATOR = '\n\n';

/** Base URL of the Codama spec documentation. Tracks the spec repo's default branch. */
export const SPEC_DOCS_BASE_URL = 'https://github.com/codama-idl/spec/blob/main/docs';

/**
 * Docs output subdirectory per spec category, relative to the docs root. The empty string is the root itself.
 * Deliberately distinct from `CATEGORY_DIRECTORIES` in `shared/defaults.ts`: source output files the `shared`
 * category under `shared/`, while the docs tree files it under `sharedNodes/`.
 */
export const DOCS_CATEGORY_DIRECTORIES: ReadonlyMap<string, string> = new Map([
    ['contextualValue', 'contextualValueNodes'],
    ['count', 'countNodes'],
    ['discriminator', 'discriminatorNodes'],
    ['display', 'displayNodes'],
    ['link', 'linkNodes'],
    ['pdaSeed', 'pdaSeedNodes'],
    ['shared', 'sharedNodes'],
    ['topLevel', ''],
    ['type', 'typeNodes'],
    ['value', 'valueNodes'],
]);

/** Section heading per entity kind, in the order the groups appear on a category index. */
export const GROUPS: readonly { readonly heading: string; readonly kind: EntityKind }[] = [
    { heading: 'Nodes', kind: 'node' },
    { heading: 'Unions', kind: 'union' },
    { heading: 'Nested unions', kind: 'nestedUnion' },
    { heading: 'Enumerations', kind: 'enumeration' },
];
