# `SetTypeNode`

A unique-valued collection. The item type is defined by `item`; the size is determined by the `count` strategy.

## Attributes

### Data

| Attribute | Type            | Description             |
| --------- | --------------- | ----------------------- |
| `kind`    | `"setTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                      | Description                                         |
| --------- | ----------------------------------------- | --------------------------------------------------- |
| `item`    | [`TypeNode`](./TypeNode.md)               | The type of each item in the set.                   |
| `count`   | [`CountNode`](../countNodes/CountNode.md) | The strategy used to determine the number of items. |

## Functions

### `setTypeNode(item, count)`

Helper function that creates a `SetTypeNode` object from a `TypeNode` and a `CountNode`.

```ts
const node = setTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode('u32')));
```

## Examples

### u32 prefixed array of u8 numbers

```ts
setTypeNode(numberTypeNode('u8'), prefixedCountNode(numberTypeNode('u32')));

// Set (1, 2, 3) => 0x03000000010203
```
