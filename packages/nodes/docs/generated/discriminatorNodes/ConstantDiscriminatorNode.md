# `ConstantDiscriminatorNode`

Identifies a node by a constant value at a known byte offset (e.g. a magic header).

## Attributes

### Data

| Attribute | Type                          | Description                                   |
| --------- | ----------------------------- | --------------------------------------------- |
| `kind`    | `"constantDiscriminatorNode"` | The node discriminator.                       |
| `offset`  | `u64`                         | The byte offset at which the constant begins. |

### Children

| Attribute  | Type                                                      | Description                                |
| ---------- | --------------------------------------------------------- | ------------------------------------------ |
| `constant` | [`ConstantValueNode`](../valueNodes/ConstantValueNode.md) | The constant value expected at the offset. |

## Functions

### `constantDiscriminatorNode(constant, offset?)`

Helper function that creates a `ConstantDiscriminatorNode` object from a constant value node and an optional offset.

```ts
const node = constantDiscriminatorNode(constantValueNodeFromString('utf8', 'Hello'), 64);
```

## Examples

### An account distinguished by a u32 number equal to 42 at offset 0

```ts
accountNode({
    discriminators: [constantDiscriminatorNode(constantValueNode(numberTypeNode('u32'), numberValueNode(42)))],
    // ...
});
```

### An instruction disctinguished by an 8-byte hash at offset 0

```ts
instructionNode({
    discriminators: [constantValueNodeFromBytes('base16', '0011223344556677')],
    // ...
});
```
