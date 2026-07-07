# `RemainderOptionTypeNode`

A value that may be present or absent. Presence is signalled by whether any bytes remain to be read, with no explicit prefix.

## Attributes

### Data

| Attribute | Type                        | Description             |
| --------- | --------------------------- | ----------------------- |
| `kind`    | `"remainderOptionTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                        | Description                                  |
| --------- | --------------------------- | -------------------------------------------- |
| `item`    | [`TypeNode`](./TypeNode.md) | The type carried by the option when present. |

## Functions

### `remainderOptionTypeNode(item)`

Helper function that creates a `RemainderOptionTypeNode` object from the item `TypeNode`.

```ts
const node = remainderOptionTypeNode(publicKeyTypeNode());
```

## Examples

### An optional UTF-8 string using remaining bytes

```ts
remainderOptionTypeNode(stringTypeNode('UTF-8'));

// None          => 0x
// Some("Hello") => 0x48656C6C6F
```
