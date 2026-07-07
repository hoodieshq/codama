# `HiddenSuffixTypeNode`

Suffixes another type with a list of constant values that are written and read but not surfaced as fields to consumers.

## Attributes

### Data

| Attribute | Type                     | Description             |
| --------- | ------------------------ | ----------------------- |
| `kind`    | `"hiddenSuffixTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                        | Description                                                            |
| --------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `type`    | [`TypeNode`](./TypeNode.md)                                 | The wrapped type whose serialisation is followed by the hidden suffix. |
| `suffix`  | [`ConstantValueNode`](../valueNodes/ConstantValueNode.md)[] | The constant values written after the wrapped type, in order.          |

## Functions

### `hiddenSuffixTypeNode(type, suffix)`

Helper function that creates a `HiddenSuffixTypeNode` object from a type node and an array of constant value nodes.

```ts
const node = hiddenSuffixTypeNode(numberTypeNode('u32'), [
    constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff')),
]);
```

## Examples

### A number suffixed with 0xFFFF

```ts
hiddenSuffixTypeNode(numberTypeNode('u32'), [constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff'))]);

// 42 => 0x2A000000FFFF
```

### A fixed UTF-8 string suffixed with "Hello"

```ts
hiddenSuffixTypeNode(fixedSizeTypeNode(stringTypeNode('utf8'), 10), [
    constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello')),
]);

// World => 0x576F726C64000000000048656c6c6F
```
