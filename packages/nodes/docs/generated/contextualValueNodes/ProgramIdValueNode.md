# `ProgramIdValueNode`

Refers to the program ID of the surrounding instruction.

## Attributes

### Data

| Attribute | Type                   | Description             |
| --------- | ---------------------- | ----------------------- |
| `kind`    | `"programIdValueNode"` | The node discriminator. |

## Functions

### `programIdValueNode()`

Helper function that creates a `ProgramIdValueNode` object.

```ts
const node = programIdValueNode();
```
