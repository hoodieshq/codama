# `InstructionNode`

A program instruction: its accounts, arguments, byte-delta hints, discriminators, optional status, and optional sub-instructions.

![Diagram](https://github.com/codama-idl/codama/assets/3642397/0d8edced-cfa4-4500-b80c-ebc56181a338)

## Attributes

### Data

| Attribute | Type                    | Description                                 |
| --------- | ----------------------- | ------------------------------------------- |
| `kind`    | `"instructionNode"`     | The node discriminator.                     |
| `name`    | `CamelCaseString`       | The name of the instruction.                |
| `docs`    | `string[]` _(optional)_ | Markdown documentation for the instruction. |

### Children

| Attribute                 | Type                                                                                       | Description                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `optionalAccountStrategy` | [`OptionalAccountStrategy`](./sharedNodes/OptionalAccountStrategy.md) _(optional)_         | How absent optional accounts are represented when serialising the instruction.                            |
| `accounts`                | [`InstructionAccountNode`](./InstructionAccountNode.md)[]                                  | The accounts the instruction operates on, in order.                                                       |
| `arguments`               | [`InstructionArgumentNode`](./InstructionArgumentNode.md)[]                                | The serialised arguments of the instruction, in order.                                                    |
| `extraArguments`          | [`InstructionArgumentNode`](./InstructionArgumentNode.md)[] _(optional)_                   | Additional arguments exposed in the generated client API but not serialised on the wire.                  |
| `remainingAccounts`       | [`InstructionRemainingAccountsNode`](./InstructionRemainingAccountsNode.md)[] _(optional)_ | Variable-length tails of accounts appended after the named account slots.                                 |
| `byteDeltas`              | [`InstructionByteDeltaNode`](./InstructionByteDeltaNode.md)[] _(optional)_                 | Byte-size adjustments applied when computing rent or buffer size — for instructions that resize accounts. |
| `discriminators`          | [`DiscriminatorNode`](./discriminatorNodes/DiscriminatorNode.md)[] _(optional)_            | Discriminators that distinguish this instruction from others.                                             |
| `status`                  | [`InstructionStatusNode`](./InstructionStatusNode.md) _(optional)_                         | The lifecycle status of the instruction.                                                                  |
| `subInstructions`         | [`InstructionNode`](./InstructionNode.md)[] _(optional)_                                   | Inner instructions invoked through CPI as part of executing this instruction.                             |
| `provides`                | [`ProvidedNode`](./ProvidedNode.md)[] _(optional)_                                         | Named nodes exposed to consumers in the surrounding scope.                                                |
| `display`                 | [`InstructionDisplayNode`](./displayNodes/InstructionDisplayNode.md) _(optional)_          | Display metadata describing how the instruction is presented.                                             |

## Functions

### `instructionNode(input)`

Helper function that creates a `InstructionNode` object from an input object.

```ts
const node = instructionNode({
    name: 'increment',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: true }),
    ],
    arguments: [instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') })],
});
```

### `getAllInstructionArguments(instruction)`

Helper function that returns all arguments — including extra arguments — of an instruction as a `InstructionArgumentNode[]`.

```ts
const allArguments = getAllInstructionArguments(instruction);
```

### `getAllInstructionsWithSubs()`

Helper function that returns all instructions with their nested sub-instructions, if any. It can be called on a `RootNode`, `ProgramNode`, or `InstructionNode`.

```ts
const allInstructionsFromTheRoot = getAllInstructionsWithSubs(rootNode);
const allInstructionsFromThisProgram = getAllInstructionsWithSubs(programNode);
const allInstructionsFromThisInstruction = getAllInstructionsWithSubs(instructionNode);
```

## Examples

### An instruction with a u8 discriminator

```ts
instructionNode({
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
});
```

### An instruction that creates a new account

```ts
instructionNode({
    name: 'createCounter',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: false }),
    ],
    byteDeltas: [instructionByteDeltaNode(accountLinkNode('counter'))],
});
```

### An instruction with omitted optional accounts

```ts
instructionNode({
    name: 'initialize',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: true }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: false }),
        instructionAccountNode({ name: 'freezeAuthority', isWritable: false, isSigner: false, isOptional: true }),
    ],
    optionalAccountStrategy: 'omitted',
});
```

### An instruction with remaining signers

```ts
instructionNode({
    name: 'multisigIncrement',
    accounts: [instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false })],
    remainingAccounts: [instructionRemainingAccountsNode(argumentValueNode('authorities'), { isSigner: true })],
});
```

### An instruction with nested versioned instructions

```ts
instructionNode({
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
});
```

### A deprecated instruction

```ts
instructionNode({
    name: 'oldIncrement',
    status: instructionStatusNode(
        'deprecated',
        'Use the `increment` instruction instead. This will be removed in v3.0.0.',
    ),
    accounts: [instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false })],
    arguments: [instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') })],
});
```

### An archived instruction

```ts
instructionNode({
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
});
```

### A draft instruction

```ts
instructionNode({
    name: 'experimentalFeature',
    status: instructionStatusNode('draft', 'This instruction is under development and may change.'),
    accounts: [instructionAccountNode({ name: 'config', isWritable: true, isSigner: true })],
    arguments: [],
});
```
