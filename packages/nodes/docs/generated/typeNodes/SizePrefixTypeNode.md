# `SizePrefixTypeNode`

Wraps another type with a numeric prefix indicating the byte length of the wrapped type.

## Attributes

### Data

| Attribute | Type                   | Description             |
| --------- | ---------------------- | ----------------------- |
| `kind`    | `"sizePrefixTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                                             | Description                                                   |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `type`    | [`TypeNode`](./TypeNode.md)                                                      | The wrapped type whose serialisation is preceded by its size. |
| `prefix`  | [`NestedTypeNode`](./NestedTypeNode.md)<[`NumberTypeNode`](./NumberTypeNode.md)> | The numeric type used as the size prefix.                     |

## Functions

### `sizePrefixTypeNode(type, prefix)`

Helper function that creates a `SizePrefixTypeNode` object from a type node and a `NumberTypeNode` prefix.

```ts
const node = sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u32'));
```

## Examples

### A UTF-8 string prefixed with a u16 size

```ts
sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u16'));

// ""      => 0x0000
// "Hello" => 0x050048656C6C6F
```
