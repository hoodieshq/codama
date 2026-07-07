# `PrefixedCountNode`

A count strategy where the number of items is read from a numeric prefix.

## Attributes

### Data

| Attribute | Type                  | Description             |
| --------- | --------------------- | ----------------------- |
| `kind`    | `"prefixedCountNode"` | The node discriminator. |

### Children

| Attribute | Type                                                                                                   | Description                                |
| --------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `prefix`  | [`NestedTypeNode`](../typeNodes/NestedTypeNode.md)<[`NumberTypeNode`](../typeNodes/NumberTypeNode.md)> | The numeric type used as the count prefix. |

## Functions

### `prefixedCountNode(prefix)`

Helper function that creates a `PrefixedCountNode` object from a number node.

```ts
const node = prefixedCountNode(numberTypeNode(u32));
```

## Examples

### An variable array of public keys prefixed with a u32

```ts
arrayTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode(u32)));
```
