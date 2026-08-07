# `ConstantPdaSeedNode`

See the [`ConstantPdaSeedNode` specification](https://github.com/codama-idl/spec/blob/main/docs/pdaSeedNodes/ConstantPdaSeedNode.md).

## Functions

### constantPdaSeedNodeFromBytes()

> **constantPdaSeedNodeFromBytes**\<`TEncoding`\>(`encoding`: `TEncoding`, `data`: `string`): `ConstantPdaSeedNode<BytesTypeNode, BytesValueNode>`

Creates a `ConstantPdaSeedNode` of type `BytesTypeNode` from an encoding and a string of data.

```ts
constantPdaSeedNodeFromBytes('base16', 'FF99CC');
// Equivalent to:
constantPdaSeedNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
```

### constantPdaSeedNodeFromProgramId()

> **constantPdaSeedNodeFromProgramId**(): `ConstantPdaSeedNode<PublicKeyTypeNode, ProgramIdValueNode>`

Creates a `ConstantPdaSeedNode` whose value is the program id, of type `PublicKeyTypeNode`.

```ts
constantPdaSeedNodeFromProgramId();
// Equivalent to:
constantPdaSeedNode(publicKeyTypeNode(), programIdValueNode());
```

### constantPdaSeedNodeFromString()

> **constantPdaSeedNodeFromString**\<`TEncoding`\>(`encoding`: `TEncoding`, `string`: `string`): `ConstantPdaSeedNode<StringTypeNode<TEncoding, undefined>, StringValueNode>`

Creates a `ConstantPdaSeedNode` of type `StringTypeNode` from an encoding and a string of data.

```ts
constantPdaSeedNodeFromString('utf8', 'tickets');
// Equivalent to:
constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('tickets'));
```
