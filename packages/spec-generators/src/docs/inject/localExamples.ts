// NOTE: this will eventually exist in the spec.
export type ExampleSpec = { readonly code: string; readonly title: string };

export const localExamples: Record<string, readonly ExampleSpec[]> = {
    accountBumpValueNode: [
        {
            code: `instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'associatedTokenAccount',
            isSigner: false,
            isWritable: true,
        }),
        // ...
    ],
    arguments: [
        instructionArgumentNode({
            name: 'bump',
            type: numberTypeNode('u8'),
            defaultValue: accountBumpValueNode('associatedTokenAccount'),
        }),
        // ...
    ],
});`,
            title: 'An instruction argument defaulting to the bump derivation of an instruction account',
        },
    ],
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
    accountValueNode: [
        {
            code: `instructionNode({
    name: 'mint',
    accounts: [
        instructionAccountNode({
            name: 'payer',
            isSigner: true,
            isWritable: false,
        }),
        instructionAccountNode({
            name: 'authority',
            isSigner: false,
            isWritable: true,
            defaultValue: accountValueNode('payer'),
        }),
        // ...
    ],
});`,
            title: 'An instruction account defaulting to another account',
        },
    ],
    amountTypeNode: [
        {
            code: `amountTypeNode(numberTypeNode('u32'), 2, 'USD');

// 0.01 USD   => 0x01000000
// 10 USD     => 0xE8030000
// 400.60 USD => 0x7C9C0000`,
            title: '2-decimals USD amount',
        },
    ],
    argumentValueNode: [
        {
            code: `instructionNode({
    name: 'mint',
    arguments: [
        instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
        }),
        instructionArgumentNode({
            name: 'amountToDelegate',
            type: numberTypeNode('u64'),
            defaultValue: argumentValueNode('amount'),
        }),
        // ...
    ],
});`,
            title: 'An instruction argument defaulting to another argument',
        },
    ],
    arrayTypeNode: [
        {
            code: `arrayTypeNode(numberTypeNode('u8'), prefixedCountNode(numberTypeNode('u32')));

// [1, 2, 3] => 0x03000000010203`,
            title: 'u32 prefixed array of u8 numbers',
        },
    ],
    booleanTypeNode: [
        {
            code: `booleanTypeNode();

// true  => 0x01
// false => 0x00`,
            title: 'u8 booleans',
        },
        {
            code: `booleanTypeNode(numberTypeNode('u32'));

// true  => 0x01000000
// false => 0x00000000`,
            title: 'u32 booleans',
        },
    ],
    conditionalValueNode: [
        {
            code: `instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'source',
            isSigner: false,
            isWritable: true,
        }),
        instructionAccountNode({
            name: 'destination',
            isSigner: false,
            isWritable: true,
            isOptional: true,
            defaultValue: conditionalValueNode({
                condition: argumentValueNode('amount'),
                value: numberValueNode(0),
                ifTrue: accountValueNode('source'),
            }),
        }),
        // ...
    ],
    arguments: [
        instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
        }),
    ],
});`,
            title: 'An instruction account that defaults to another account if a condition is met',
        },
    ],
    constantDiscriminatorNode: [
        {
            code: `accountNode({
    discriminators: [constantDiscriminatorNode(constantValueNode(numberTypeNode('u32'), numberValueNode(42)))],
    // ...
});`,
            title: 'An account distinguished by a u32 number equal to 42 at offset 0',
        },
        {
            code: `instructionNode({
    discriminators: [constantValueNodeFromBytes('base16', '0011223344556677')],
    // ...
});`,
            title: 'An instruction disctinguished by an 8-byte hash at offset 0',
        },
    ],
    constantNode: [
        {
            code: `const node = constantNode('maxSize', numberTypeNode('u32'), numberValueNode(100));`,
            title: 'Numeric Constant',
        },
        {
            code: `const node = constantNode('seedPrefix', bytesTypeNode(), bytesValueNode('base16', '74657374'));`,
            title: 'Bytes Constant',
        },
        {
            code: `const node = constantNode('maxItems', numberTypeNode('u64'), numberValueNode(1000), [
    'The maximum number of items allowed.',
]);`,
            title: 'With Documentation',
        },
    ],
    constantPdaSeedNode: [
        {
            code: `pdaNode({
    name: 'tickets',
    seeds: [constantPdaSeedNodeFromString('utf8', 'tickets')],
});`,
            title: 'A PDA node with a UTF-8 constant seed',
        },
    ],
    dateTimeTypeNode: [
        {
            code: `dateTimeTypeNode(numberTypeNode('u64'));

// 2024-06-27T14:57:56Z => 0x667D7DF400000000`,
            title: 'u64 unix datetime',
        },
    ],
    enumTypeNode: [
        {
            code: `enumTypeNode([
    enumEmptyVariantTypeNode('flip'),
    enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')])),
    enumStructVariantTypeNode(
        'move',
        structTypeNode([
            structFieldTypeNode({ name: 'x', type: numberTypeNode('u16') }),
            structFieldTypeNode({ name: 'y', type: numberTypeNode('u16') }),
        ]),
    ),
]);

// Flip                => 0x00
// Rotate (42)         => 0x012A000000
// Move { x: 1, y: 2 } => 0x0201000200`,
            title: 'Enum with u8 discriminator',
        },
    ],
    eventNode: [
        {
            code: `eventNode({
    name: 'transferEvent',
    data: structTypeNode([
        structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
});`,
            title: 'An event with a struct payload',
        },
        {
            code: `eventNode({
    name: 'transferEvent',
    data: hiddenPrefixTypeNode(structTypeNode([structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') })]), [
        constantValueNode(fixedSizeTypeNode(bytesTypeNode(), 8), bytesValueNode('base16', '0102030405060708')),
    ]),
    discriminators: [
        constantDiscriminatorNode(
            constantValueNode(fixedSizeTypeNode(bytesTypeNode(), 8), bytesValueNode('base16', '0102030405060708')),
        ),
    ],
});`,
            title: 'An event with a hidden prefix discriminator',
        },
    ],
    fieldDiscriminatorNode: [
        {
            code: `accountNode({
    data: structTypeNode([
        structFieldTypeNode({
            name: 'discriminator',
            type: numberTypeNode('u32'),
            defaultValue: numberValueNode(42),
            defaultValueStrategy: 'omitted',
        }),
        // ...
    ]),
    discriminators: [fieldDiscriminatorNode('discriminator')],
    // ...
});`,
            title: 'An account distinguished by a u32 field at offset 0',
        },
        {
            code: `instructionNode({
    arguments: [
        instructionArgumentNode({
            name: 'discriminator',
            type: fixedSizeTypeNode(bytesTypeNode(), 8),
            defaultValue: bytesValueNode('base16', '0011223344556677'),
            defaultValueStrategy: 'omitted',
        }),
        // ...
    ],
    discriminators: [fieldDiscriminatorNode('discriminator')],
    // ...
});`,
            title: 'An instruction disctinguished by an 8-byte argument at offset 0',
        },
    ],
    fixedCountNode: [
        {
            code: `arrayTypeNode(publicKeyTypeNode(), fixedCountNode(3));`,
            title: 'An array of three public keys',
        },
    ],
    fixedSizeTypeNode: [
        {
            code: `fixedSizeTypeNode(stringTypeNode('utf8'), 10);

// Hello => 0x48656C6C6F0000000000`,
            title: 'Fixed UTF-8 strings',
        },
        {
            code: `fixedSizeTypeNode(bytesTypeNode(), 4);

// [1, 2]          => 0x01020000
// [1, 2, 3, 4, 5] => 0x01020304`,
            title: 'Fixed byte arrays',
        },
    ],
    hiddenPrefixTypeNode: [
        {
            code: `hiddenPrefixTypeNode(numberTypeNode('u32'), [constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff'))]);

// 42 => 0xFFFF2A000000`,
            title: 'A number prefixed with 0xFFFF',
        },
        {
            code: `hiddenPrefixTypeNode(fixedSizeTypeNode(stringTypeNode('utf8'), 10), [
    constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello')),
]);

// World => 0x48656C6C6F576F726C640000000000`,
            title: 'A fixed UTF-8 string prefixed with "Hello"',
        },
    ],
    hiddenSuffixTypeNode: [
        {
            code: `hiddenSuffixTypeNode(numberTypeNode('u32'), [constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff'))]);

// 42 => 0x2A000000FFFF`,
            title: 'A number suffixed with 0xFFFF',
        },
        {
            code: `hiddenSuffixTypeNode(fixedSizeTypeNode(stringTypeNode('utf8'), 10), [
    constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello')),
]);

// World => 0x576F726C64000000000048656c6c6F`,
            title: 'A fixed UTF-8 string suffixed with "Hello"',
        },
    ],
    identityValueNode: [
        {
            code: `instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'authority',
            isSigner: true,
            isWritable: false,
            defaultValue: identityValueNode(),
        }),
        // ...
    ],
});`,
            title: 'An instruction account defaulting to the identity value',
        },
    ],
    instructionAccountNode: [
        {
            code: `instructionAccountNode({
    name: 'freezeAuthority',
    isWritable: false,
    isSigner: false,
    isOptional: true,
    docs: ['The freeze authority to set on the asset, if any.'],
});`,
            title: 'An optional account',
        },
        {
            code: `instructionAccountNode({
    name: 'owner',
    isWritable: true,
    isSigner: 'either',
    docs: ['The owner of the asset. The owner must only sign the transaction if the asset is being updated.'],
});`,
            title: 'An optional signer account',
        },
    ],
    instructionArgumentNode: [
        {
            code: `instructionArgumentNode({
    name: 'amount',
    type: numberTypeNode('u64'),
    defaultValue: numberValueNode(0),
});`,
            title: 'An argument with a default value',
        },
        {
            code: `instructionArgumentNode({
    name: 'instructionDiscriminator',
    type: numberTypeNode('u8'),
    defaultValue: numberValueNode(42),
    defaultValueStrategy: 'omitted',
});`,
            title: 'An argument with an omitted default value',
        },
    ],
    instructionByteDeltaNode: [
        {
            code: `instructionByteDeltaNode(accountLinkNode('token'));`,
            title: 'A byte delta that represents a new account',
        },
        {
            code: `instructionByteDeltaNode(accountLinkNode('token'), { subtract: true });`,
            title: 'A byte delta that represents an account deletion',
        },
        {
            code: `instructionByteDeltaNode(argumentValueNode('additionalSpace'), { withHeader: false });`,
            title: 'A byte delta that uses an argument value to increase the space of an account',
        },
    ],
    instructionNode: [
        {
            code: `instructionNode({
    name: 'increment',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: false }),
    ],
    arguments: [
        instructionArgumentNode({
            name: 'discriminator',
            type: numberTypeNode('u8'),
            defaultValue: numberValueNode(42),
            defaultValueStrategy: 'omitted',
        }),
    ],
});`,
            title: 'An instruction with a u8 discriminator',
        },
        {
            code: `instructionNode({
    name: 'createCounter',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: false }),
    ],
    byteDeltas: [instructionByteDeltaNode(accountLinkNode('counter'))],
});`,
            title: 'An instruction that creates a new account',
        },
        {
            code: `instructionNode({
    name: 'initialize',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: false }),
        instructionAccountNode({ name: 'freezeAuthority', isWritable: false, isSigner: false, isOptional: true }),
    ],
    optionalAccountStrategy: 'omitted',
});`,
            title: 'An instruction with omitted optional accounts',
        },
        {
            code: `instructionNode({
    name: 'multisigIncrement',
    accounts: [instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false })],
    remainingAccounts: [instructionRemainingAccountsNode(argumentValueNode('authorities'), { isSigner: true })],
});`,
            title: 'An instruction with remaining signers',
        },
        {
            code: `instructionNode({
    name: 'increment',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: 'either' }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: true }),
    ],
    arguments: [
        instructionArgumentNode({ name: 'version', type: numberTypeNode('u8') }),
        instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') }),
    ],
    subInstructions: [
        instructionNode({
            name: 'incrementV1',
            accounts: [instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true })],
            arguments: [
                instructionArgumentNode({
                    name: 'version',
                    type: numberTypeNode('u8'),
                    defaultValue: numberValueNode(0),
                    defaultValueStrategy: 'omitted',
                }),
                instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') }),
            ],
        }),
        instructionNode({
            name: 'incrementV2',
            accounts: [
                instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false }),
                instructionAccountNode({ name: 'authority', isWritable: false, isSigner: true }),
            ],
            arguments: [
                instructionArgumentNode({
                    name: 'version',
                    type: numberTypeNode('u8'),
                    defaultValue: numberValueNode(1),
                    defaultValueStrategy: 'omitted',
                }),
                instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') }),
            ],
        }),
    ],
});`,
            title: 'An instruction with nested versioned instructions',
        },
        {
            code: `instructionNode({
    name: 'oldIncrement',
    status: instructionStatusNode(
        'deprecated',
        'Use the \`increment\` instruction instead. This will be removed in v3.0.0.',
    ),
    accounts: [instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false })],
    arguments: [instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') })],
});`,
            title: 'A deprecated instruction',
        },
        {
            code: `instructionNode({
    name: 'legacyTransfer',
    status: instructionStatusNode(
        'archived',
        'This instruction was removed in v2.0.0. It is kept here for historical parsing.',
    ),
    accounts: [
        instructionAccountNode({ name: 'source', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'destination', isWritable: true, isSigner: false }),
    ],
    arguments: [instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') })],
});`,
            title: 'An archived instruction',
        },
        {
            code: `instructionNode({
    name: 'experimentalFeature',
    status: instructionStatusNode('draft', 'This instruction is under development and may change.'),
    accounts: [instructionAccountNode({ name: 'config', isWritable: true, isSigner: true })],
    arguments: [],
});`,
            title: 'A draft instruction',
        },
    ],
    instructionRemainingAccountsNode: [
        {
            code: `instructionRemainingAccountsNode(argumentValueNode('authorities'), {
    isSigner: true,
    isOptional: true,
});`,
            title: 'Optional remaining signers',
        },
        {
            code: `instructionRemainingAccountsNode(argumentValueNode('authorities'), {
    isSigner: 'either',
});`,
            title: 'Remaining accounts that may or may not be signers',
        },
        {
            code: `instructionRemainingAccountsNode(
    resolverValueNode('resolveTransferRemainingAccounts', {
        docs: ['Provide authorities as remaining accounts if and only if the asset has a multisig set up.'],
        dependsOn: [argumentValueNode('hasMultisig'), argumentValueNode('authorities')],
    }),
);`,
            title: 'Remaining accounts using a resolver',
        },
    ],
    instructionStatusNode: [
        {
            code: `instructionNode({
    name: 'transfer',
    accounts: [...],
    arguments: [...],
});`,
            title: 'A live instruction (no status needed)',
        },
        {
            code: `instructionNode({
    name: 'oldTransfer',
    status: instructionStatusNode('deprecated', 'Use the \`transfer\` instruction instead. This will be removed in v3.0.0.'),
    accounts: [...],
    arguments: [...],
});`,
            title: 'A deprecated instruction',
        },
        {
            code: `instructionNode({
    name: 'legacyTransfer',
    status: instructionStatusNode('archived', 'This instruction was removed in v2.0.0. It is kept here for historical parsing.'),
    accounts: [...],
    arguments: [...],
});`,
            title: 'An archived instruction',
        },
        {
            code: `instructionNode({
    name: 'experimentalFeature',
    status: instructionStatusNode('draft', 'This instruction is under development and may change.'),
    accounts: [...],
    arguments: [...],
});`,
            title: 'A draft instruction',
        },
        {
            code: `instructionNode({
    name: 'someInstruction',
    status: instructionStatusNode('deprecated'),
    accounts: [...],
    arguments: [...],
});`,
            title: 'Status without a message',
        },
    ],
    mapTypeNode: [
        {
            code: `mapTypeNode(
    fixedSizeTypeNode(stringTypeNode('utf8'), 1), // Key: Single UTF-8 character.
    numberTypeNode('u16'), // Value: 16-bit unsigned integer.
    prefixedCountNode(numberTypeNode('u8')), // Count: map length is prefixed with a u8.
);

// { A: 42, B: 1, C: 16 } => 0x03000000412A00420100431000`,
            title: 'An histogram that counts letters',
        },
    ],
    numberTypeNode: [
        {
            code: `numberTypeNode('u32');

// 5     => 0x00000000
// 42    => 0x2A000000
// 65535 => 0xFFFF0000`,
            title: 'Encoding `u32` integers',
        },
        {
            code: `numberTypeNode('f32', 'be');

// 1      => 0x3F800000
// -42    => 0xC2280000
// 3.1415 => 0x40490E56`,
            title: 'Encoding `f32` big-endian decimal numbers',
        },
        {
            code: `numberTypeNode('shortU16');

// 42    => 0x2A
// 128   => 0x8001
// 16384 => 0x808001`,
            title: 'Encoding `shortU16` integers',
        },
    ],
    optionTypeNode: [
        {
            code: `optionTypeNode(stringTypeNode('UTF-8'), { prefix: numberTypeNode('u16') });

// None          => 0x0000
// Some("Hello") => 0x010048656C6C6F`,
            title: 'An optional UTF-8 with a u16 prefix',
        },
        {
            code: `optionTypeNode(numberTypeNode('u32'), { fixed: true });

// None     => 0x0000000000
// Some(42) => 0x012A000000`,
            title: 'A fixed optional u32 number',
        },
    ],
    payerValueNode: [
        {
            code: `instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'payer',
            isSigner: true,
            isWritable: false,
            defaultValue: payerValueNode(),
        }),
        // ...
    ],
});`,
            title: 'An instruction account defaulting to the payer value',
        },
    ],
    pdaNode: [
        {
            code: `pdaNode({
    name: 'ticket',
    seeds: [
        constantPdaSeedNodeFromString('utf8', 'raffles'),
        variablePdaSeedNode('raffle', publicKeyTypeNode()),
        constantPdaSeedNodeFromString('utf8', 'tickets'),
        variablePdaSeedNode('ticketNumber', numberTypeNode('u32')),
    ],
});`,
            title: 'A PDA with constant and variable seeds',
        },
        {
            code: `pdaNode({
    name: 'seedlessPda',
    seeds: [],
});`,
            title: 'A PDA with no seeds',
        },
    ],
    pdaValueNode: [
        {
            code: `pdaValueNode('associatedToken', [
    pdaSeedValueNode('mint', accountValueNode('mint')),
    pdaSeedValueNode('owner', accountValueNode('authority')),
]);`,
            title: 'A PDA value whose seeds point to other accounts',
        },
        {
            code: `const inlinedPdaNode = pdaNode({
    name: 'associatedToken',
    seeds: [
        variablePdaSeedNode('mint', publicKeyTypeNode()),
        constantPdaSeedNode(publicKeyTypeNode(), publicKeyValueNode('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')),
        variablePdaSeedNode('owner', publicKeyTypeNode()),
    ],
});

pdaValueNode(inlinedPdaNode, [
    pdaSeedValueNode('mint', accountValueNode('mint')),
    pdaSeedValueNode('owner', accountValueNode('authority')),
]);`,
            title: 'A PDA value with an inlined PDA definition',
        },
    ],
    postOffsetTypeNode: [
        {
            code: `postOffsetTypeNode(numberTypeNode('u32'), 4, 'padded');

// 42 => 0x2A00000000000000`,
            title: 'A right-padded u32 number',
        },
        {
            code: `tupleTypleNode([postOffsetTypeNode(numberTypeNode('u32'), -2), numberTypeNode('u16')]);

// [1, 2]           => 0x01000200
// [0xFFFFFFFF, 42] => 0xFFFF2A00`,
            title: 'A u32 number overwritten by a u16 number',
        },
    ],
    preOffsetTypeNode: [
        {
            code: `preOffsetTypeNode(numberTypeNode('u32'), 4, 'padded');

// 42 => 0x000000002A000000`,
            title: 'A left-padded u32 number',
        },
        {
            code: `tupleTypleNode([numberTypeNode('u32'), preOffsetTypeNode(numberTypeNode('u16'), -2)]);

// [1, 2]           => 0x01000200
// [0xFFFFFFFF, 42] => 0xFFFF2A00`,
            title: 'A u32 number overwritten by a u16 number',
        },
    ],
    prefixedCountNode: [
        {
            code: `arrayTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode(u32)));`,
            title: 'An variable array of public keys prefixed with a u32',
        },
    ],
    remainderCountNode: [
        {
            code: `arrayTypeNode(publicKeyTypeNode(), remainderCountNode());`,
            title: 'A remainder array of public keys',
        },
    ],
    remainderOptionTypeNode: [
        {
            code: `remainderOptionTypeNode(stringTypeNode('UTF-8'));

// None          => 0x
// Some("Hello") => 0x48656C6C6F`,
            title: 'An optional UTF-8 string using remaining bytes',
        },
    ],
    rootNode: [
        {
            code: `const node = rootNode(
    programNode({
        name: 'counter',
        publicKey: '2R3Ui2TVUUCyGcZdopxJauk8ZBzgAaHHZCVUhm5ifPaC',
        version: '1.0.0',
        accounts: [
            accountNode({
                name: 'counter',
                data: structTypeNode([
                    structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
                    structFieldTypeNode({ name: 'value', type: numberTypeNode('u32') }),
                ]),
            }),
        ],
        instructions: [
            instructionNode({ name: 'create' /* ... */ }),
            instructionNode({ name: 'increment' /* ... */ }),
            instructionNode({ name: 'transferAuthority' /* ... */ }),
            instructionNode({ name: 'delete' /* ... */ }),
        ],
    }),
);`,
            title: 'A root node with a single program',
        },
    ],
    sentinelTypeNode: [
        {
            code: `sentinelTypeNode(stringTypeNode('utf8'), constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ff')));

// Hello => 0x48656C6C6FFF`,
            title: 'A UTF-8 string terminated by 0xFF',
        },
    ],
    setTypeNode: [
        {
            code: `setTypeNode(numberTypeNode('u8'), prefixedCountNode(numberTypeNode('u32')));

// Set (1, 2, 3) => 0x03000000010203`,
            title: 'u32 prefixed array of u8 numbers',
        },
    ],
    sizeDiscriminatorNode: [
        {
            code: `accountNode({
    discriminators: [sizeDiscriminatorNode(42)],
    // ...
});`,
            title: 'An account distinguished by its size being equal to 42',
        },
        {
            code: `instructionNode({
    discriminators: [sizeDiscriminatorNode(42)],
    // ...
});`,
            title: 'An instruction disctinguished by its size being equal to 42',
        },
    ],
    sizePrefixTypeNode: [
        {
            code: `sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u16'));

// ""      => 0x0000
// "Hello" => 0x050048656C6C6F`,
            title: 'A UTF-8 string prefixed with a u16 size',
        },
    ],
    solAmountTypeNode: [
        {
            code: `solAmountTypeNode(numberTypeNode('u64'));

// 1.5 SOL => 0x002F685900000000
// 300 SOL => 0x00B864D945000000`,
            title: 'u64 Solana amounts',
        },
    ],
    structFieldTypeNode: [
        {
            code: `structFieldTypeNode({
    name: 'age',
    type: numberTypeNode('u8'),
    defaultValue: numberValueNode(42),
});

// {}          => 0x2A
// { age: 29 } => 0x1D`,
            title: 'A struct field with a default value',
        },
    ],
    structTypeNode: [
        {
            code: `structTypeNode([
    structFieldTypeNode({ name: 'name', type: fixedSizeTypeNode(stringTypeNode('utf8'), 10) }),
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u8') }),
]);

// { name: Alice, age: 42 } => 0x416C69636500000000002A`,
            title: "A struct storing a person's name and age",
        },
    ],
    tupleTypeNode: [
        {
            code: `tupleTypeNode([fixedSizeTypeNode(stringTypeNode('utf8'), 10), numberTypeNode('u8')]);

// (Alice, 42) => 0x416C69636500000000002A`,
            title: "A tuple storing a person's name and age",
        },
    ],
    variablePdaSeedNode: [
        {
            code: `pdaNode({
    name: 'ticket',
    seeds: [variablePdaSeedNode('authority', publicKeyTypeNode())],
});`,
            title: 'A PDA node with a public key variable seed',
        },
    ],
    zeroableOptionTypeNode: [
        {
            code: `zeroableOptionTypeNode(numbetypeNode('u32'));

// None     => 0x00000000
// Some(42) => 0x2A000000`,
            title: 'a u32 zeroable option',
        },
        {
            code: `zeroableOptionTypeNode(numbetypeNode('u32'), constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffffffff')));

// None     => 0xFFFFFFFF
// Some(42) => 0x2A000000`,
            title: 'a u32 zeroable option with a custom zero value',
        },
    ],
};
