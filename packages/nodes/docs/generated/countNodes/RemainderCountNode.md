# `RemainderCountNode`

A count strategy where items are read until the buffer is exhausted.

## Attributes

### Data

| Attribute | Type                   | Description             |
| --------- | ---------------------- | ----------------------- |
| `kind`    | `"remainderCountNode"` | The node discriminator. |

## Functions

### `remainderCountNode()`

Helper function that creates a `RemainderCountNode` object.

```ts
const node = remainderCountNode();
```

## Examples

### A remainder array of public keys

```ts
arrayTypeNode(publicKeyTypeNode(), remainderCountNode());
```
