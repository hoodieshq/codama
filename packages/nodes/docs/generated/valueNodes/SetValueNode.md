# `SetValueNode`

A concrete set value: a list of unique value nodes.

## Attributes

### Data

| Attribute | Type             | Description             |
| --------- | ---------------- | ----------------------- |
| `kind`    | `"setValueNode"` | The node discriminator. |

### Children

| Attribute | Type                            | Description           |
| --------- | ------------------------------- | --------------------- |
| `items`   | [`ValueNode`](./ValueNode.md)[] | The items of the set. |

## Functions

### `setValueNode(items)`

Helper function that creates a `SetValueNode` object from an array of value nodes.

```ts
const node = setValueNode([numberValueNode(1), numberValueNode(2), numberValueNode(3)]);
```
