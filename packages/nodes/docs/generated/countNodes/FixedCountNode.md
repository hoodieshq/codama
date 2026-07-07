# `FixedCountNode`

A count strategy that fixes the number of items at a constant value.

## Attributes

### Data

| Attribute | Type               | Description                |
| --------- | ------------------ | -------------------------- |
| `kind`    | `"fixedCountNode"` | The node discriminator.    |
| `value`   | `u64`              | The fixed number of items. |

## Functions

### `fixedCountNode(value)`

Helper function that creates a `FixedCountNode` object from a number.

```ts
const node = fixedCountNode(42);
```

## Examples

### An array of three public keys

```ts
arrayTypeNode(publicKeyTypeNode(), fixedCountNode(3));
```
