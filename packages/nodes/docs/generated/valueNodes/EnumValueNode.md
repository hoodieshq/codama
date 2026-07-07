# `EnumValueNode`

A concrete value of a defined enum: a variant identifier plus an optional payload.

## Attributes

### Data

| Attribute | Type              | Description                       |
| --------- | ----------------- | --------------------------------- |
| `kind`    | `"enumValueNode"` | The node discriminator.           |
| `variant` | `CamelCaseString` | The name of the selected variant. |

### Children

| Attribute | Type                                                         | Description                                                                                   |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `enum`    | [`DefinedTypeLinkNode`](../linkNodes/DefinedTypeLinkNode.md) | A link to the defined enum type the value belongs to.                                         |
| `value`   | [`EnumValuePayload`](./EnumValuePayload.md) _(optional)_     | The variant payload — a struct value for struct variants or a tuple value for tuple variants. |

## Functions

### `enumValueNode(enum, variant, value?)`

Helper function that creates a `EnumValueNode` object from an enum type, a variant name, and an optional value node for its data. The first argument can be a `DefinedTypeLinkNode` or a `string` matching the name of the defined enum type.

```ts
const node = enumValueNode('myEnum', 'myVariant');
const nodeWithExplicitEnum = enumValueNode(definedTypeLinkNode('myEnum'), 'myVariant');

const nodeWithData = enumValueNode(
    'myEnum',
    'myVariantWithData',
    structValueNode([
        structFieldValueNode('name', stringValueNode('Alice')),
        structFieldValueNode('age', numberValueNode(42)),
    ]),
);
```
