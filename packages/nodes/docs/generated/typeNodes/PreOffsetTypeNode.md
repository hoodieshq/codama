# `PreOffsetTypeNode`

Before serialising the wrapped type, advance the cursor by `offset` bytes interpreted via the chosen strategy.

## Attributes

### Data

| Attribute | Type                  | Description                                                   |
| --------- | --------------------- | ------------------------------------------------------------- |
| `kind`    | `"preOffsetTypeNode"` | The node discriminator.                                       |
| `offset`  | `i64`                 | The signed byte offset to apply before the wrapped type runs. |

### Children

| Attribute  | Type                                                       | Description                                                     |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| `strategy` | [`PreOffsetStrategy`](../sharedNodes/PreOffsetStrategy.md) | How the `offset` value is interpreted.                          |
| `type`     | [`TypeNode`](./TypeNode.md)                                | The wrapped type whose serialisation is preceded by the offset. |

## Functions

### `preOffsetTypeNode(type, offset, strategy?)`

Helper function that creates a `PreOffsetTypeNode` object from a child `TypeNode`, an offset and — optionally — a strategy which defaults to `"relative"`.

```ts
const relativeOffsetNode = preOffsetTypeNode(numberTypeNode('u32'), 2);
const absoluteOffsetNode = preOffsetTypeNode(numberTypeNode('u32'), -2, 'absolute');
```

## Examples

### A left-padded u32 number

```ts
preOffsetTypeNode(numberTypeNode('u32'), 4, 'padded');

// 42 => 0x000000002A000000
```

### A u32 number overwritten by a u16 number

```ts
tupleTypleNode([numberTypeNode('u32'), preOffsetTypeNode(numberTypeNode('u16'), -2)]);

// [1, 2]           => 0x01000200
// [0xFFFFFFFF, 42] => 0xFFFF2A00
```
