# `DateTimeTypeNode`

A timestamp encoded as a number, typically seconds since the Unix epoch. The wrapped number type determines the byte width.

## Attributes

### Data

| Attribute | Type                 | Description             |
| --------- | -------------------- | ----------------------- |
| `kind`    | `"dateTimeTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                                             | Description                                       |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `number`  | [`NestedTypeNode`](./NestedTypeNode.md)<[`NumberTypeNode`](./NumberTypeNode.md)> | The numeric type used to serialise the timestamp. |

## Functions

### `dateTimeTypeNode(number)`

Helper function that creates a `DateTimeTypeNode` object from a `NumberTypeNode`.

```ts
const node = dateTimeTypeNode(numberTypeNode('u64'));
```

## Examples

### u64 unix datetime

```ts
dateTimeTypeNode(numberTypeNode('u64'));

// 2024-06-27T14:57:56Z => 0x667D7DF400000000
```
