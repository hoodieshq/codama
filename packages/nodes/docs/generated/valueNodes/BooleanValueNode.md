# `BooleanValueNode`

A concrete boolean value.

## Attributes

### Data

| Attribute | Type                 | Description             |
| --------- | -------------------- | ----------------------- |
| `kind`    | `"booleanValueNode"` | The node discriminator. |
| `boolean` | `boolean`            | The boolean value.      |

## Functions

### `booleanValueNode(items)`

Helper function that creates a `BooleanValueNode` object from a boolean.

```ts
const node = booleanValueNode(true);
```
