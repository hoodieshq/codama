# `BytesValueNode`

A concrete bytes value, encoded as text in the chosen encoding.

## Attributes

### Data

| Attribute | Type               | Description                                                      |
| --------- | ------------------ | ---------------------------------------------------------------- |
| `kind`    | `"bytesValueNode"` | The node discriminator.                                          |
| `data`    | `string`           | The bytes encoded as a text string per the `encoding` attribute. |

### Children

| Attribute  | Type                                               | Description                                       |
| ---------- | -------------------------------------------------- | ------------------------------------------------- |
| `encoding` | [`BytesEncoding`](../sharedNodes/BytesEncoding.md) | The encoding used to represent the bytes as text. |

## Functions

### `bytesValueNode(encoding, data)`

Helper function that creates a `BytesValueNode` object from an encoding and an encoded data string.

```ts
const node = bytesValueNode('base16', '010203');
const utf8Node = bytesValueNode('utf8', 'Hello');
```
