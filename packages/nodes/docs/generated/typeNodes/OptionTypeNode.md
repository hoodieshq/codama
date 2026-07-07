# `OptionTypeNode`

A value that may be present or absent (Some/None), with an explicit numeric prefix indicating presence.

## Attributes

### Data

| Attribute | Type                   | Description                                                                                                             |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `kind`    | `"optionTypeNode"`     | The node discriminator.                                                                                                 |
| `fixed`   | `boolean` _(optional)_ | When `true`, the absent variant still occupies the byte size of the present variant (zero-padded). Defaults to `false`. |

### Children

| Attribute | Type                                                                             | Description                                  |
| --------- | -------------------------------------------------------------------------------- | -------------------------------------------- |
| `item`    | [`TypeNode`](./TypeNode.md)                                                      | The type carried by the option when present. |
| `prefix`  | [`NestedTypeNode`](./NestedTypeNode.md)<[`NumberTypeNode`](./NumberTypeNode.md)> | The numeric type used as the presence flag.  |

## Functions

### `optionTypeNode(item, options?)`

Helper function that creates a `OptionTypeNode` object from the item `TypeNode` and an optional configuration object.

```ts
const node = optionTypeNode(publicKeyTypeNode());
const nodeWithCustomPrefix = optionTypeNode(publicKeyTypeNode(), { prefix: numberTypeNode('u16') });
const fixedNode = optionTypeNode(publicKeyTypeNode(), { fixed: true });
```

## Examples

### An optional UTF-8 with a u16 prefix

```ts
optionTypeNode(stringTypeNode('UTF-8'), { prefix: numberTypeNode('u16') });

// None          => 0x0000
// Some("Hello") => 0x010048656C6C6F
```

### A fixed optional u32 number

```ts
optionTypeNode(numberTypeNode('u32'), { fixed: true });

// None     => 0x0000000000
// Some(42) => 0x012A000000
```
