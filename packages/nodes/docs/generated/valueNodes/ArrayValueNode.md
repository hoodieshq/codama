# `ArrayValueNode`

A concrete array value: a list of value nodes.

## Attributes

### Data

| Attribute | Type               | Description             |
| --------- | ------------------ | ----------------------- |
| `kind`    | `"arrayValueNode"` | The node discriminator. |

### Children

| Attribute | Type                            | Description                       |
| --------- | ------------------------------- | --------------------------------- |
| `items`   | [`ValueNode`](./ValueNode.md)[] | The items of the array, in order. |

## Functions

### `arrayValueNode(items)`

Helper function that creates a `ArrayValueNode` object from an array of value nodes.

```ts
const node = arrayValueNode([numberValueNode(1), numberValueNode(2), numberValueNode(3)]);
```
