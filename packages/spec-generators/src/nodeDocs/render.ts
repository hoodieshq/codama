import { BLOCK_SEPARATOR, DOC_EXT, GROUPS, SPEC_DOCS_BASE_URL } from './constants';
import type { UtilityPage } from './extractTsdoc';
import { type CategoryPage, entityDisplayName, type EntityKind, type EntityPage } from './pages';

/** H1 suffix per entity kind. Unions are abstract, nested unions are recursive aliases. */
const TITLE_SUFFIXES: Record<EntityKind, string> = {
    enumeration: '',
    nestedUnion: ' (recursive)',
    node: '',
    union: ' (abstract)',
};

/**
 * Absolute URL of the matching page in the Codama spec documentation. The local docs tree and the spec docs
 * tree share the same layout rules, so the mapping is positional and needs no lookup table.
 */
export function specDocsUrl(pathSegments: readonly string[]): string {
    return `${SPEC_DOCS_BASE_URL}/${pathSegments.join('/')}.${DOC_EXT}`;
}

/** Join non-empty markdown blocks with a blank line between them, dropping the empty ones. */
function joinBlocks(...blocks: (string | undefined)[]): string {
    return blocks.filter((block): block is string => Boolean(block)).join(BLOCK_SEPARATOR);
}

/** A markdown inline link. */
function mdLink(name: string, ref: string): string {
    return `[${name}](${ref})`;
}

/** Bulleted link to a page in the same directory, labelled with its backticked display name. */
function entityListItem(page: EntityPage): string {
    const displayName = entityDisplayName(page);
    return `- ${mdLink(`\`${displayName}\``, `./${displayName}.${DOC_EXT}`)}`;
}

/**
 * One entity page: the heading, a pointer to the spec, and the TSDoc `## Functions` block when the node has
 * documented helpers. Attributes, children, and examples are the specification's job, not this repo's.
 */
export function renderEntityPage(page: EntityPage, functionsBlock: string | undefined): string {
    const specLink = mdLink(`\`${entityDisplayName(page)}\` specification`, specDocsUrl(page.pathSegments));
    const pointer = `See the ${specLink}.`;
    return joinBlocks(`# ${entityTitle(page)}`, pointer, functionsBlock);
}

/** One category index: a link list per non-empty entity group, then a pointer to the spec's category index. */
export function renderCategoryIndex(category: CategoryPage): string {
    const groups = GROUPS.map(({ heading, kind }) => {
        const entities = category.entities.filter(entity => entity.entityKind === kind);
        return entities.length === 0 ? undefined : joinBlocks(`## ${heading}`, entities.map(entityListItem).join('\n'));
    });
    const specUrl = specDocsUrl([category.directory, 'README']);
    const pointer = `See the ${mdLink(`${category.title} specification`, specUrl)}.`;
    return joinBlocks(`# ${category.title}`, ...groups, pointer);
}

/**
 * The docs root index. The provenance line is the only record of which spec revision the stubs were generated
 * from, since every link tracks the spec repo's default branch rather than a pinned tag.
 */
export function renderRootIndex(
    inventory: readonly CategoryPage[],
    specVersion: string,
    utilityPages: readonly UtilityPage[],
): string {
    // The top-level category has no index of its own: its entities are listed here instead.
    const topLevel = inventory.find(category => category.directory === '');
    const categories = inventory.filter(category => category.directory !== '');
    const intro =
        'TypeScript node helpers. Attributes, children, and examples are defined by the ' +
        `${mdLink('Codama specification', specDocsUrl(['README']))}.`;
    const categoryLinks = categories
        .map(category => `- ${mdLink(category.title, `./${category.directory}/README.${DOC_EXT}`)}`)
        .join('\n');
    const utilityLinks = utilityPages
        .map(page => `- ${mdLink(page.title, `./${page.pathSegments.join('/')}.${DOC_EXT}`)}`)
        .join('\n');
    return joinBlocks(
        '# Codama nodes',
        intro,
        `Generated from \`@codama/spec\` ${specVersion}.`,
        categoryLinks ? '## Categories' : undefined,
        categoryLinks,
        topLevel ? '## TopLevel' : undefined,
        topLevel?.entities.map(entityListItem).join('\n'),
        utilityLinks ? '## Utilities' : undefined,
        utilityLinks,
    );
}

/** The page's H1 text: the backticked display name plus its kind suffix. Link labels drop the suffix. */
export function entityTitle(page: EntityPage): string {
    return `\`${entityDisplayName(page)}\`${TITLE_SUFFIXES[page.entityKind]}`;
}
