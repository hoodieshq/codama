# `EnumTypeNode`

See the [`EnumTypeNode` specification](https://github.com/codama-idl/spec/blob/main/docs/typeNodes/EnumTypeNode.md).

## Functions

### isDataEnum()

> **isDataEnum**(`node`: `EnumTypeNode`): `boolean`

Returns true when at least one variant of the enum carries associated data (a tuple or struct variant).

```ts
isDataEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // true
isDataEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // false
```

### isScalarEnum()

> **isScalarEnum**(`node`: `EnumTypeNode`): `boolean`

Returns true when every variant of the enum is empty, meaning the enum carries no associated data.

```ts
isScalarEnum(enumTypeNode([enumEmptyVariantTypeNode('flip')])); // true
isScalarEnum(enumTypeNode([enumTupleVariantTypeNode('rotate', tupleTypeNode([numberTypeNode('u32')]))])); // false
```
