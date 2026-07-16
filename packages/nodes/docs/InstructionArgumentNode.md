# `InstructionArgumentNode`

A named argument of an instruction, with its type and an optional default value.

![Diagram](https://github.com/codama-idl/codama/assets/3642397/7e2def82-949a-4663-bdc3-ac599d39d2d2)

## Attributes

### Data

| Attribute | Type                        | Description                              |
| --------- | --------------------------- | ---------------------------------------- |
| `kind`    | `"instructionArgumentNode"` | The node discriminator.                  |
| `name`    | `CamelCaseString`           | The name of the argument.                |
| `docs`    | `string[]` _(optional)_     | Markdown documentation for the argument. |

### Children

| Attribute              | Type                                                                                            | Description                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `defaultValueStrategy` | [`DefaultValueStrategy`](./sharedNodes/DefaultValueStrategy.md) _(optional)_                    | How a configured default value is exposed in generated APIs. Required when `defaultValue` is set. |
| `type`                 | [`TypeNode`](./typeNodes/TypeNode.md)                                                           | The type of the argument.                                                                         |
| `defaultValue`         | [`InstructionInputValueNode`](./contextualValueNodes/InstructionInputValueNode.md) _(optional)_ | A default value used when the argument is omitted by callers.                                     |
| `display`              | [`StructFieldDisplayNode`](./displayNodes/StructFieldDisplayNode.md) _(optional)_               | Display metadata describing how the argument is presented.                                        |

## Functions

### structFieldTypeNodeFromInstructionArgumentNode()

> **structFieldTypeNodeFromInstructionArgumentNode**(`node`: `InstructionArgumentNode`): `StructFieldTypeNode<TypeNode, undefined, undefined>`

Converts an instruction argument node into a `StructFieldTypeNode`.
The default value is kept only when it is a value node, otherwise the field is emitted without a default.

```ts
const field = structFieldTypeNodeFromInstructionArgumentNode(
    instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
);
```

### structTypeNodeFromInstructionArgumentNodes()

> **structTypeNodeFromInstructionArgumentNodes**(`nodes`: `InstructionArgumentNode[]`): `StructTypeNode<any>`

Builds a `StructTypeNode` from an array of instruction argument nodes by converting each into a struct field.

```ts
const struct = structTypeNodeFromInstructionArgumentNodes([
    instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
]);
```

## Examples

### An argument with a default value

```typescript
instructionArgumentNode({
    name: 'amount',
    type: numberTypeNode('u64'),
    defaultValue: numberValueNode(0),
});
```

### An argument with an omitted default value

```typescript
instructionArgumentNode({
    name: 'instructionDiscriminator',
    type: numberTypeNode('u8'),
    defaultValue: numberValueNode(42),
    defaultValueStrategy: 'omitted',
});
```
