import { getRecordLinkablesVisitor, LinkableDictionary, RootNode, visit } from 'codama';

export function buildLinkables(root: RootNode): LinkableDictionary {
    const linkables = new LinkableDictionary();
    visit(root, getRecordLinkablesVisitor(linkables));
    return linkables;
}
