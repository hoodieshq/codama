# `InstructionArgumentNode`

See the [`InstructionArgumentNode` specification](https://github.com/codama-idl/spec/blob/main/docs/InstructionArgumentNode.md).

## Functions

### structFieldTypeNodeFromInstructionArgumentNode()

> **structFieldTypeNodeFromInstructionArgumentNode**(`node`): `StructFieldTypeNode`\<`TypeNode`, `ArrayValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `BooleanValueNode` \| `BytesValueNode` \| `ConstantValueNode`\<`TypeNode`, `StandaloneValueNode`\> \| `EnumValueNode`\<`DefinedTypeLinkNode`\<`ProgramLinkNode` \| `undefined`\>, `EnumValuePayload` \| `undefined`\> \| `InjectedValueNode`\<`StandaloneValueNode` \| `undefined`\> \| `MapValueNode`\<`MapEntryValueNode`\<`StandaloneValueNode`, `StandaloneValueNode`\>[] \| `undefined`\> \| `NoneValueNode` \| `NumberValueNode` \| `PublicKeyValueNode` \| `SetValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `SomeValueNode`\<`StandaloneValueNode`\> \| `StringValueNode` \| `StructValueNode`\<`StructFieldValueNode`\<`StandaloneValueNode`\>[] \| `undefined`\> \| `TupleValueNode`\<`StandaloneValueNode`[] \| `undefined`\>, `StructFieldDisplayNode`\> \| `StructFieldTypeNode`\<`TypeNode`, `undefined`, `StructFieldDisplayNode`\>

Converts an instruction argument node into a `StructFieldTypeNode`.
The default value (and its strategy) is kept only when the default is a value node, otherwise both are dropped.

#### Parameters

##### node

`InstructionArgumentNode`

#### Returns

`StructFieldTypeNode`\<`TypeNode`, `ArrayValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `BooleanValueNode` \| `BytesValueNode` \| `ConstantValueNode`\<`TypeNode`, `StandaloneValueNode`\> \| `EnumValueNode`\<`DefinedTypeLinkNode`\<`ProgramLinkNode` \| `undefined`\>, `EnumValuePayload` \| `undefined`\> \| `InjectedValueNode`\<`StandaloneValueNode` \| `undefined`\> \| `MapValueNode`\<`MapEntryValueNode`\<`StandaloneValueNode`, `StandaloneValueNode`\>[] \| `undefined`\> \| `NoneValueNode` \| `NumberValueNode` \| `PublicKeyValueNode` \| `SetValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `SomeValueNode`\<`StandaloneValueNode`\> \| `StringValueNode` \| `StructValueNode`\<`StructFieldValueNode`\<`StandaloneValueNode`\>[] \| `undefined`\> \| `TupleValueNode`\<`StandaloneValueNode`[] \| `undefined`\>, `StructFieldDisplayNode`\> \| `StructFieldTypeNode`\<`TypeNode`, `undefined`, `StructFieldDisplayNode`\>

#### Example

```ts
const field = structFieldTypeNodeFromInstructionArgumentNode(
    instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
);
```

---

### structTypeNodeFromInstructionArgumentNodes()

> **structTypeNodeFromInstructionArgumentNodes**(`nodes`): `StructTypeNode`\<(`StructFieldTypeNode`\<`TypeNode`, `ArrayValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `BooleanValueNode` \| `BytesValueNode` \| `ConstantValueNode`\<`TypeNode`, `StandaloneValueNode`\> \| `EnumValueNode`\<`DefinedTypeLinkNode`\<`ProgramLinkNode` \| `undefined`\>, `EnumValuePayload` \| `undefined`\> \| `InjectedValueNode`\<`StandaloneValueNode` \| `undefined`\> \| `MapValueNode`\<`MapEntryValueNode`\<`StandaloneValueNode`, `StandaloneValueNode`\>[] \| `undefined`\> \| `NoneValueNode` \| `NumberValueNode` \| `PublicKeyValueNode` \| `SetValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `SomeValueNode`\<`StandaloneValueNode`\> \| `StringValueNode` \| `StructValueNode`\<`StructFieldValueNode`\<`StandaloneValueNode`\>[] \| `undefined`\> \| `TupleValueNode`\<`StandaloneValueNode`[] \| `undefined`\>, `StructFieldDisplayNode`\> \| `StructFieldTypeNode`\<`TypeNode`, `undefined`, `StructFieldDisplayNode`\>)[]\>

Builds a `StructTypeNode` from an array of instruction argument nodes by converting each into a struct field.

#### Parameters

##### nodes

`InstructionArgumentNode`[]

#### Returns

`StructTypeNode`\<(`StructFieldTypeNode`\<`TypeNode`, `ArrayValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `BooleanValueNode` \| `BytesValueNode` \| `ConstantValueNode`\<`TypeNode`, `StandaloneValueNode`\> \| `EnumValueNode`\<`DefinedTypeLinkNode`\<`ProgramLinkNode` \| `undefined`\>, `EnumValuePayload` \| `undefined`\> \| `InjectedValueNode`\<`StandaloneValueNode` \| `undefined`\> \| `MapValueNode`\<`MapEntryValueNode`\<`StandaloneValueNode`, `StandaloneValueNode`\>[] \| `undefined`\> \| `NoneValueNode` \| `NumberValueNode` \| `PublicKeyValueNode` \| `SetValueNode`\<`StandaloneValueNode`[] \| `undefined`\> \| `SomeValueNode`\<`StandaloneValueNode`\> \| `StringValueNode` \| `StructValueNode`\<`StructFieldValueNode`\<`StandaloneValueNode`\>[] \| `undefined`\> \| `TupleValueNode`\<`StandaloneValueNode`[] \| `undefined`\>, `StructFieldDisplayNode`\> \| `StructFieldTypeNode`\<`TypeNode`, `undefined`, `StructFieldDisplayNode`\>)[]\>

#### Example

```ts
const struct = structTypeNodeFromInstructionArgumentNodes([
    instructionArgumentNode({ name: 'amount', type: numberTypeNode('u64') }),
]);
```
