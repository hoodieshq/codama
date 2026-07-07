# `PostOffsetTypeNode`

After serialising the wrapped type, advance the cursor by `offset` bytes interpreted via the chosen strategy.

## Attributes

### Data

| Attribute | Type                   | Description                                                  |
| --------- | ---------------------- | ------------------------------------------------------------ |
| `kind`    | `"postOffsetTypeNode"` | The node discriminator.                                      |
| `offset`  | `i64`                  | The signed byte offset to apply after the wrapped type runs. |

### Children

| Attribute  | Type                                                         | Description                                                     |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| `strategy` | [`PostOffsetStrategy`](../sharedNodes/PostOffsetStrategy.md) | How the `offset` value is interpreted.                          |
| `type`     | [`TypeNode`](./TypeNode.md)                                  | The wrapped type whose serialisation is followed by the offset. |

## Functions

### `postOffsetTypeNode(type, offset, strategy?)`

Helper function that creates a `PostOffsetTypeNode` object from a child `TypeNode`, an offset and — optionally — a strategy which defaults to `"relative"`.

```ts
const relativeOffsetNode = postOffsetTypeNode(numberTypeNode('u32'), 2);
const absoluteOffsetNode = postOffsetTypeNode(numberTypeNode('u32'), -2, 'absolute');
```

## Examples

### A right-padded u32 number

```ts
postOffsetTypeNode(numberTypeNode('u32'), 4, 'padded');

// 42 => 0x2A00000000000000
```

### A u32 number overwritten by a u16 number

```ts
tupleTypleNode([postOffsetTypeNode(numberTypeNode('u32'), -2), numberTypeNode('u16')]);

// [1, 2]           => 0x01000200
// [0xFFFFFFFF, 42] => 0xFFFF2A00
```
