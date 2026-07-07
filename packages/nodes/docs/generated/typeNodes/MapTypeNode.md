# `MapTypeNode`

A keyed map. The key and value types are described by their respective type nodes; the entry count is determined by a count strategy.

## Attributes

### Data

| Attribute | Type            | Description             |
| --------- | --------------- | ----------------------- |
| `kind`    | `"mapTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                      | Description                                           |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| `key`     | [`TypeNode`](./TypeNode.md)               | The type of each entry key.                           |
| `value`   | [`TypeNode`](./TypeNode.md)               | The type of each entry value.                         |
| `count`   | [`CountNode`](../countNodes/CountNode.md) | The strategy used to determine the number of entries. |

## Functions

### `mapTypeNode(key, value, count)`

Helper function that creates a `MapTypeNode` object from a key `TypeNode`, a value `TypeNode` and a `CountNode`.

```ts
const node = mapTypeNode(publicKeyTypeNode(), numberTypeNode('u32'), prefixedCountNode(numberTypeNode('u32')));
```

## Examples

### An histogram that counts letters

```ts
mapTypeNode(
    fixedSizeTypeNode(stringTypeNode('utf8'), 1), // Key: Single UTF-8 character.
    numberTypeNode('u16'), // Value: 16-bit unsigned integer.
    prefixedCountNode(numberTypeNode('u8')), // Count: map length is prefixed with a u8.
);

// { A: 42, B: 1, C: 16 } => 0x03000000412A00420100431000
```
