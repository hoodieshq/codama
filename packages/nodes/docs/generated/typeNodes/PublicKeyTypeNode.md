# `PublicKeyTypeNode`

A 32-byte Solana public key.

## Attributes

### Data

| Attribute | Type                  | Description             |
| --------- | --------------------- | ----------------------- |
| `kind`    | `"publicKeyTypeNode"` | The node discriminator. |

## Functions

### `publicKeyTypeNode()`

Helper function that creates a `PublicKeyTypeNode` object.

```ts
const node = publicKeyTypeNode();
```
