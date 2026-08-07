import { pascalCase } from '@codama/fragments/javascript';
import type { CategorySpec, Spec } from '@codama/spec';

/** The four spec entity flavours that each get their own documentation page. */
export type EntityKind = 'enumeration' | 'nestedUnion' | 'node' | 'union';

export interface EntityPage {
    readonly entityKind: EntityKind;
    /** Spec name, e.g. 'numberTypeNode'. Also the key the extractor's `functions` record uses. */
    readonly name: string;
    /** Extension-less path segments relative to the docs root, e.g. ['typeNodes', 'NumberTypeNode']. */
    readonly pathSegments: readonly string[];
}

export interface CategoryPage {
    /** Output subdirectory relative to the docs root. Empty string for the top-level category. */
    readonly directory: string;
    readonly entities: readonly EntityPage[];
    /** Spec category name, e.g. 'type'. */
    readonly name: string;
    /** Rendered H1 text, e.g. 'Type'. */
    readonly title: string;
}

/** The page's PascalCase name with no kind suffix, e.g. 'NumberTypeNode'. Always the last path segment. */
export function entityDisplayName(page: EntityPage): string {
    return page.pathSegments[page.pathSegments.length - 1];
}

/**
 * Turn a spec into the ordered list of documentation pages it implies.
 * Categories sort by title and entities sort by display name within each kind group, matching the docs layout.
 */
export function buildPageInventory(
    spec: Spec,
    categoryDirectories: ReadonlyMap<string, string>,
): readonly CategoryPage[] {
    return spec.categories
        .map(category => buildCategoryPage(category, categoryDirectories))
        .sort((a, b) => a.title.localeCompare(b.title));
}

function buildCategoryPage(category: CategorySpec, categoryDirectories: ReadonlyMap<string, string>): CategoryPage {
    const directory = categoryDirectories.get(category.name);
    if (directory === undefined) {
        throw new Error(`No docs directory configured for spec category "${category.name}".`);
    }
    const entities = [
        ...category.nodes.map(n => buildEntityPage('node', n.kind, directory)).sort(sortByDisplayName),
        ...category.unions.map(u => buildEntityPage('union', u.name, directory)).sort(sortByDisplayName),
        ...category.nestedUnions.map(u => buildEntityPage('nestedUnion', u.name, directory)).sort(sortByDisplayName),
        ...category.enumerations.map(e => buildEntityPage('enumeration', e.name, directory)).sort(sortByDisplayName),
    ];
    return { directory, entities, name: category.name, title: pascalCase(category.name) };
}

function buildEntityPage(entityKind: EntityKind, name: string, directory: string): EntityPage {
    const displayName = pascalCase(name);
    return {
        entityKind,
        name,
        pathSegments: directory === '' ? [displayName] : [directory, displayName],
    };
}

const sortByDisplayName = (a: EntityPage, b: EntityPage): number =>
    entityDisplayName(a).localeCompare(entityDisplayName(b));
