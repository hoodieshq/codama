# `BytesTypeNode`

A raw sequence of bytes. Typically used inside a fixed-size, size-prefixed, or sentinel-terminated wrapper.

## Attributes

### Data

| Attribute | Type              | Description             |
| --------- | ----------------- | ----------------------- |
| `kind`    | `"bytesTypeNode"` | The node discriminator. |

## Functions

### `bytesTypeNode()`

Helper function that creates a `BytesTypeNode` object.

```ts
const node = bytesTypeNode();
```
