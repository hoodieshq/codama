# `FieldDiscriminatorNode`

Identifies a node by the value of a named field at a known byte offset.

## Attributes

### Data

| Attribute | Type                       | Description                           |
| --------- | -------------------------- | ------------------------------------- |
| `kind`    | `"fieldDiscriminatorNode"` | The node discriminator.               |
| `name`    | `CamelCaseString`          | The name of the discriminating field. |
| `offset`  | `u64`                      | The byte offset of the field.         |

## Functions

### `fieldDiscriminatorNode(field, offset?)`

Helper function that creates a `FieldDiscriminatorNode` object from a field name and an optional offset.

```ts
const node = fieldDiscriminatorNode('accountState', 64);
```

## Examples

### An account distinguished by a u32 field at offset 0

```ts
accountNode({
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
});
```

### An instruction disctinguished by an 8-byte argument at offset 0

```ts
instructionNode({
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
});
```
