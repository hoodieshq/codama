# `EnumTypeNode`

A tagged union: a numeric discriminator followed by one of several variant payloads.

## Attributes

### Data

| Attribute | Type             | Description             |
| --------- | ---------------- | ----------------------- |
| `kind`    | `"enumTypeNode"` | The node discriminator. |

### Children

| Attribute  | Type                                                                             | Description                                           |
| ---------- | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `variants` | [`EnumVariantTypeNode`](./EnumVariantTypeNode.md)[]                              | The variants of the enum, in declaration order.       |
| `size`     | [`NestedTypeNode`](./NestedTypeNode.md)<[`NumberTypeNode`](./NumberTypeNode.md)> | The numeric type used to serialise the discriminator. |

## Functions

### `enumTypeNode(variants, options?)`

Helper function that creates a `EnumTypeNode` object from an array of `EnumVariantTypeNode` objects and an optional `size` attribute that can be passed in the `options` object as a second argument.

```ts
const node = enumTypeNode(variants);
const nodeWithU32Discriminator = enumTypeNode(variants, { size: numberTypeNode('u32') });
```

## Examples

### Enum with u8 discriminator

```ts
enumTypeNode([
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
// Move { x: 1, y: 2 } => 0x0201000200
```
