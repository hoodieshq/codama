export const localFunctions: Record<string, string> = {
    accountNode: `## Functions

### \`accountNode(input)\`

Helper function that creates a \`AccountNode\` object from an input object.

\`\`\`ts
const node = accountNode({
    name: 'myCounter',
    data: structTypeNode([
        structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
    ]),
});
\`\`\``,
    // TODO: Port the remaining `## Functions` blocks from packages/nodes/docs/** verbatim.
};
