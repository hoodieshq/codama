# `HiddenPrefixTypeNode`

Prefixes another type with a list of constant values that are written and read but not surfaced as fields to consumers.

## Attributes

### Data

| Attribute | Type                     | Description             |
| --------- | ------------------------ | ----------------------- |
| `kind`    | `"hiddenPrefixTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                        | Description                                                            |
| --------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `type`    | [`TypeNode`](./TypeNode.md)                                 | The wrapped type whose serialisation is preceded by the hidden prefix. |
| `prefix`  | [`ConstantValueNode`](../valueNodes/ConstantValueNode.md)[] | The constant values written before the wrapped type, in order.         |

## Functions

### `hiddenPrefixTypeNode(type, prefix)`

Helper function that creates a `HiddenPrefixTypeNode` object from a type node and an array of constant value nodes.

```ts
const node = hiddenPrefixTypeNode(numberTypeNode('u32'), [
    constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff')),
]);
```

## Examples

### A number prefixed with 0xFFFF

```ts
hiddenPrefixTypeNode(numberTypeNode('u32'), [constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff'))]);

// 42 => 0xFFFF2A000000
```

### A fixed UTF-8 string prefixed with "Hello"

```ts
hiddenPrefixTypeNode(fixedSizeTypeNode(stringTypeNode('utf8'), 10), [
    constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello')),
]);

// World => 0x48656C6C6F576F726C640000000000
```
