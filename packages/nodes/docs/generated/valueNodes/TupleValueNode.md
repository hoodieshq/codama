# `TupleValueNode`

A concrete tuple value: a fixed-length sequence of positional value nodes.

## Attributes

### Data

| Attribute | Type               | Description             |
| --------- | ------------------ | ----------------------- |
| `kind`    | `"tupleValueNode"` | The node discriminator. |

### Children

| Attribute | Type                            | Description                                  |
| --------- | ------------------------------- | -------------------------------------------- |
| `items`   | [`ValueNode`](./ValueNode.md)[] | The positional items of the tuple, in order. |

## Functions

### `tupleValueNode(items)`

Helper function that creates a `TupleValueNode` object from an array of value nodes.

```ts
const node = tupleValueNode([stringValueNode('Alice'), numberValueNode(42)]);
```
