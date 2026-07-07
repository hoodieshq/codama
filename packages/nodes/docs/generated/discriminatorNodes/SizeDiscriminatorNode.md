# `SizeDiscriminatorNode`

Identifies a node by its expected total byte size.

## Attributes

### Data

| Attribute | Type                      | Description             |
| --------- | ------------------------- | ----------------------- |
| `kind`    | `"sizeDiscriminatorNode"` | The node discriminator. |
| `size`    | `u64`                     | The expected byte size. |

## Functions

### `sizeDiscriminatorNode(size)`

Helper function that creates a `SizeDiscriminatorNode` object from a size.

```ts
const node = sizeDiscriminatorNode(165);
```

## Examples

### An account distinguished by its size being equal to 42

```ts
accountNode({
    discriminators: [sizeDiscriminatorNode(42)],
    // ...
});
```

### An instruction disctinguished by its size being equal to 42

```ts
instructionNode({
    discriminators: [sizeDiscriminatorNode(42)],
    // ...
});
```
