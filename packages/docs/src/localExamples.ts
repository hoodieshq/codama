/**
 * Codama-specific (TypeScript) documentation layered on top of the spec.
 *
 * The spec describes nodes language-agnostically; these are the TS bits that
 * don't belong in the spec: helper-function usage (`## Functions`) and TS code
 * examples. `localExamples` is *merged* into each node's spec `examples[]`
 * (rendered as `## Examples`); `localFunctions` is appended as a separate
 * `## Functions` section via the generator's `extendNode` seam.
 *
 * Seeded from the hand-written docs in `@codama/nodes` (`packages/nodes/docs`).
 * Keyed by node `kind`; nodes without an entry just render their spec body.
 */

import type { ExampleSpec } from '@codama/spec/api';

export const localExamples: Record<string, readonly ExampleSpec[]> = {
    accountNode: [
        {
            title: 'A fixed-size account',
            code: [
                'const node = accountNode({',
                "    name: 'token',",
                '    data: structTypeNode([',
                "        structFieldTypeNode({ name: 'mint', type: publicKeyTypeNode() }),",
                "        structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),",
                "        structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),",
                '    ]),',
                '    discriminators: [sizeDiscriminatorNode(72)],',
                '    size: 72,',
                '});',
            ].join('\n'),
        },
        {
            title: 'An account with a linked PDA',
            code: [
                'programNode({',
                "    name: 'myProgram',",
                '    accounts: [',
                '        accountNode({',
                "            name: 'token',",
                "            data: structTypeNode([structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() })]),",
                "            pda: pdaLinkNode('myPda'),",
                '        }),',
                '    ],',
                '    pdas: [',
                '        pdaNode({',
                "            name: 'myPda',",
                '            seeds: [',
                "                constantPdaSeedNodeFromString('utf8', 'token'),",
                "                variablePdaSeedNode('authority', publicKeyTypeNode()),",
                '            ],',
                '        }),',
                '    ],',
                '});',
            ].join('\n'),
        },
    ],
    amountTypeNode: [
        {
            title: '2-decimals USD amount',
            code: [
                "amountTypeNode(numberTypeNode('u32'), 2, 'USD');",
                '',
                '// 0.01 USD   => 0x01000000',
                '// 10 USD     => 0xE8030000',
                '// 400.60 USD => 0x7C9C0000',
            ].join('\n'),
        },
    ],
};

export const localFunctions: Record<string, string> = {
    accountNode: [
        '## Functions',
        '',
        '### `accountNode(input)`',
        '',
        'Helper function that creates an `AccountNode` object from an input object.',
        '',
        '```ts',
        'const node = accountNode({',
        "    name: 'myCounter',",
        '    data: structTypeNode([',
        "        structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),",
        "        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),",
        '    ]),',
        '});',
        '```',
    ].join('\n'),
    amountTypeNode: [
        '## Functions',
        '',
        '### `amountTypeNode(number, decimals, unit?)`',
        '',
        'Helper function that creates an `AmountTypeNode` object from a `NumberTypeNode`, a number of decimals and an optional unit.',
        '',
        '```ts',
        "const node = amountTypeNode(numberTypeNode('u64'), 2, 'USD');",
        "const nodeWithoutUnits = amountTypeNode(numberTypeNode('u16'), 2);",
        '```',
    ].join('\n'),
};
