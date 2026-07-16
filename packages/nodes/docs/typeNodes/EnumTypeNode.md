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

### isDataEnum()

> **isDataEnum**(`node`: `EnumTypeNode`): `boolean`

Returns true when at least one variant of the enum carries associated data (a tuple or struct variant).

```ts
isDataEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // true
isDataEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // false
```

### isScalarEnum()

> **isScalarEnum**(`node`: `EnumTypeNode`): `boolean`

Returns true when every variant of the enum is empty, meaning the enum carries no associated data.

```ts
isScalarEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // true
isScalarEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // false
```

## Examples

### Enum with u8 discriminator

```typescript
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
