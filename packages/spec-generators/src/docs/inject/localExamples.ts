// NOTE: this will eventually exist in the spec.
export type ExampleSpec = { readonly code: string; readonly title: string };

export const localExamples: Record<string, readonly ExampleSpec[]> = {
    accountNode: [
        {
            code: `const node = accountNode({
    name: 'token',
    data: structTypeNode([
        structFieldTypeNode({ name: 'mint', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
    discriminators: [sizeDiscriminatorNode(72)],
    size: 72,
});`,
            title: 'A fixed-size account',
        },
        {
            code: `programNode({
    name: 'myProgram',
    accounts: [
        accountNode({
            name: 'token',
            data: structTypeNode([structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() })]),
            pda: pdaLinkNode('myPda'),
        }),
    ],
    pdas: [
        pdaNode({
            name: 'myPda',
            seeds: [
                constantPdaSeedNodeFromString('utf8', 'token'),
                variablePdaSeedNode('authority', publicKeyTypeNode()),
            ],
        }),
    ],
});`,
            title: 'An account with a linked PDA',
        },
    ],
    // TODO: Port the remaining `## Examples` blocks from packages/nodes/docs/** as (title, code) pairs.
};
