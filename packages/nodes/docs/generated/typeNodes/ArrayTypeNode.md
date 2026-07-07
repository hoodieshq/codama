# `ArrayTypeNode`

A homogeneous list of items. The item type is defined by `item`; the length is determined by the `count` strategy.

## Attributes

### Data

| Attribute | Type              | Description             |
| --------- | ----------------- | ----------------------- |
| `kind`    | `"arrayTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                      | Description                                         |
| --------- | ----------------------------------------- | --------------------------------------------------- |
| `item`    | [`TypeNode`](./TypeNode.md)               | The type of each item in the array.                 |
| `count`   | [`CountNode`](../countNodes/CountNode.md) | The strategy used to determine the number of items. |

## Functions

### `arrayTypeNode(item, count)`

Helper function that creates a `ArrayTypeNode` object from a `TypeNode` and a `CountNode`.

```ts
const node = arrayTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode('u32')));
```

## Examples

### u32 prefixed array of u8 numbers

```ts
arrayTypeNode(numberTypeNode('u8'), prefixedCountNode(numberTypeNode('u32')));

// [1, 2, 3] => 0x03000000010203
```
