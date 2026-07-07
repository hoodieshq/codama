# `InstructionStatusNode`

The lifecycle stage of an instruction (draft, live, deprecated, archived) with an optional accompanying message.

## Attributes

### Data

| Attribute | Type                      | Description                                                                                  |
| --------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `kind`    | `"instructionStatusNode"` | The node discriminator.                                                                      |
| `message` | `string` _(optional)_     | Free-form prose accompanying the status — e.g. a deprecation notice with migration guidance. |

### Children

| Attribute   | Type                                                            | Description          |
| ----------- | --------------------------------------------------------------- | -------------------- |
| `lifecycle` | [`InstructionLifecycle`](./sharedNodes/InstructionLifecycle.md) | The lifecycle stage. |

## Functions

### `instructionStatusNode(lifecycle, message?)`

Helper function that creates an `InstructionStatusNode` object.

```ts
const statusNode = instructionStatusNode('deprecated', 'Use the newInstruction instead');
```

## Examples

### A live instruction (no status needed)

```ts
instructionNode({
    name: 'transfer',
    accounts: [...],
    arguments: [...],
});
```

### A deprecated instruction

```ts
instructionNode({
    name: 'oldTransfer',
    status: instructionStatusNode('deprecated', 'Use the `transfer` instruction instead. This will be removed in v3.0.0.'),
    accounts: [...],
    arguments: [...],
});
```

### An archived instruction

```ts
instructionNode({
    name: 'legacyTransfer',
    status: instructionStatusNode('archived', 'This instruction was removed in v2.0.0. It is kept here for historical parsing.'),
    accounts: [...],
    arguments: [...],
});
```

### A draft instruction

```ts
instructionNode({
    name: 'experimentalFeature',
    status: instructionStatusNode('draft', 'This instruction is under development and may change.'),
    accounts: [...],
    arguments: [...],
});
```

### Status without a message

```ts
instructionNode({
    name: 'someInstruction',
    status: instructionStatusNode('deprecated'),
    accounts: [...],
    arguments: [...],
});
```
