# `StructTypeNode`

A composite type made of an ordered list of named fields. Fields are encoded and decoded in declaration order.

## Attributes

### Data

| Attribute | Type               | Description             |
| --------- | ------------------ | ----------------------- |
| `kind`    | `"structTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                | Description                                     |
| --------- | --------------------------------------------------- | ----------------------------------------------- |
| `fields`  | [`StructFieldTypeNode`](./StructFieldTypeNode.md)[] | The fields of the struct, in declaration order. |

## Functions

### `structTypeNode(fields)`

Helper function that creates a `StructTypeNode` object from an array of `StructFieldTypeNode` objects.

```ts
const node = structTypeNode([
    structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
]);
```

## Examples

### A struct storing a person's name and age

```ts
structTypeNode([
    structFieldTypeNode({ name: 'name', type: fixedSizeTypeNode(stringTypeNode('utf8'), 10) }),
    structFieldTypeNode({ name: 'age', type: numberTypeNode('u8') }),
]);

// { name: Alice, age: 42 } => 0x416C69636500000000002A
```
