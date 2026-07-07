# `StringValueNode`

A concrete string value.

## Attributes

### Data

| Attribute | Type                | Description             |
| --------- | ------------------- | ----------------------- |
| `kind`    | `"stringValueNode"` | The node discriminator. |
| `string`  | `string`            | The string value.       |

## Functions

### `stringValueNode(string)`

Helper function that creates a `StringValueNode` object from a string value.

```ts
const node = stringValueNode('Hello');
```
