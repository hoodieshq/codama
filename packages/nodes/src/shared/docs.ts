import type { Docs } from '@codama/node-types';

/** Documentation input accepted by node helpers: either a single string or an array of strings. */
export type DocsInput = string[] | string;

/**
 * Normalise a `DocsInput` into a `Docs` array. Null or undefined becomes an empty array and a single string is wrapped.
 *
 * @example
 * ```ts
 * parseDocs('A single line'); // ['A single line']
 * parseDocs(['Line one', 'Line two']); // ['Line one', 'Line two']
 * parseDocs(undefined); // []
 * ```
 */
export function parseDocs(docs: DocsInput | null | undefined): Docs {
    if (docs === null || docs === undefined) return [];
    return Array.isArray(docs) ? docs : [docs];
}
