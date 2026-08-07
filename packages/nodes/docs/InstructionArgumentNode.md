# `InstructionArgumentNode`

See the [`InstructionArgumentNode` specification](https://github.com/codama-idl/spec/blob/main/docs/InstructionArgumentNode.md).

## Functions

### structFieldTypeNodeFromInstructionArgumentNode()

> **structFieldTypeNodeFromInstructionArgumentNode**(`node`: `InstructionArgumentNode`): `StructFieldTypeNode<TypeNode, undefined, undefined>`

Converts an instruction argument node into a `StructFieldTypeNode`.
The default value (and its strategy) is kept only when the default is a value node, otherwise both are dropped.

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
