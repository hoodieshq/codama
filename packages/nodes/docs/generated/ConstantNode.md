# `ConstantNode`

A named constant exposed by the program: a typed value associated with a name.

## Attributes

### Data

| Attribute | Type                    | Description                              |
| --------- | ----------------------- | ---------------------------------------- |
| `kind`    | `"constantNode"`        | The node discriminator.                  |
| `name`    | `CamelCaseString`       | The name of the constant.                |
| `docs`    | `string[]` _(optional)_ | Markdown documentation for the constant. |

### Children

| Attribute | Type                                     | Description                         |
| --------- | ---------------------------------------- | ----------------------------------- |
| `type`    | [`TypeNode`](./typeNodes/TypeNode.md)    | The type of the constant.           |
| `value`   | [`ValueNode`](./valueNodes/ValueNode.md) | The concrete value of the constant. |

## Functions

### `constantNode(name, type, value, docs?)`

Helper function that creates a `ConstantNode` object from its attributes.

```ts
const node = constantNode('maxSize', numberTypeNode('u64'), numberValueNode(1000));
```

## Examples

### Numeric Constant

```ts
const node = constantNode('maxSize', numberTypeNode('u32'), numberValueNode(100));
```

### Bytes Constant

```ts
const node = constantNode('seedPrefix', bytesTypeNode(), bytesValueNode('base16', '74657374'));
```

### With Documentation

```ts
const node = constantNode('maxItems', numberTypeNode('u64'), numberValueNode(1000), [
    'The maximum number of items allowed.',
]);
```
