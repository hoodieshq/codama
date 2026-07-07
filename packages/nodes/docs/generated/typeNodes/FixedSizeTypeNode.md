# `FixedSizeTypeNode`

Wraps another type and asserts a fixed total byte size. Padding or truncation is applied as needed.

## Attributes

### Data

| Attribute | Type                  | Description                                       |
| --------- | --------------------- | ------------------------------------------------- |
| `kind`    | `"fixedSizeTypeNode"` | The node discriminator.                           |
| `size`    | `u64`                 | The total byte size the wrapped type must occupy. |

### Children

| Attribute | Type                        | Description                                          |
| --------- | --------------------------- | ---------------------------------------------------- |
| `type`    | [`TypeNode`](./TypeNode.md) | The wrapped type whose serialisation is constrained. |

## Functions

### `fixedSizeTypeNode(type, size)`

Helper function that creates a `FixedSizeTypeNode` object from a type node and a fixed byte length.

```ts
const node = fixedSizeTypeNode(stringTypeNode('utf8'), 32);
```

## Examples

### Fixed UTF-8 strings

```ts
fixedSizeTypeNode(stringTypeNode('utf8'), 10);

// Hello => 0x48656C6C6F0000000000
```

### Fixed byte arrays

```ts
fixedSizeTypeNode(bytesTypeNode(), 4);

// [1, 2]          => 0x01020000
// [1, 2, 3, 4, 5] => 0x01020304
```
