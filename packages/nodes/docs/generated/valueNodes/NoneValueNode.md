# `NoneValueNode`

The "absent" value for an optional type.

## Attributes

### Data

| Attribute | Type              | Description             |
| --------- | ----------------- | ----------------------- |
| `kind`    | `"noneValueNode"` | The node discriminator. |

## Functions

### `noneValueNode()`

Helper function that creates a `NoneValueNode` object.

```ts
const node = noneValueNode();
```
