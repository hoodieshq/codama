# `ConstantPdaSeedNode`

See the [`ConstantPdaSeedNode` specification](https://github.com/codama-idl/spec/blob/main/docs/pdaSeedNodes/ConstantPdaSeedNode.md).

## Functions

### constantPdaSeedNodeFromBytes()

> **constantPdaSeedNodeFromBytes**\<`TEncoding`\>(`encoding`, `data`): `ConstantPdaSeedNode`\<`BytesTypeNode`, `BytesValueNode`\>

Creates a `ConstantPdaSeedNode` of type `BytesTypeNode` from an encoding and a string of data.

#### Type Parameters

##### TEncoding

`TEncoding` _extends_ `BytesEncoding`

#### Parameters

##### encoding

`TEncoding`

##### data

`string`

#### Returns

`ConstantPdaSeedNode`\<`BytesTypeNode`, `BytesValueNode`\>

#### Example

```ts
constantPdaSeedNodeFromBytes('base16', 'FF99CC');
// Equivalent to:
constantPdaSeedNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
```

---

### constantPdaSeedNodeFromProgramId()

> **constantPdaSeedNodeFromProgramId**(): `ConstantPdaSeedNode`\<`PublicKeyTypeNode`, `ProgramIdValueNode`\>

Creates a `ConstantPdaSeedNode` whose value is the program id, of type `PublicKeyTypeNode`.

#### Returns

`ConstantPdaSeedNode`\<`PublicKeyTypeNode`, `ProgramIdValueNode`\>

#### Example

```ts
constantPdaSeedNodeFromProgramId();
// Equivalent to:
constantPdaSeedNode(publicKeyTypeNode(), programIdValueNode());
```

---

### constantPdaSeedNodeFromString()

> **constantPdaSeedNodeFromString**\<`TEncoding`\>(`encoding`, `string`): `ConstantPdaSeedNode`\<`StringTypeNode`\<`TEncoding`, `undefined`\>, `StringValueNode`\>

Creates a `ConstantPdaSeedNode` of type `StringTypeNode` from an encoding and a string of data.

#### Type Parameters

##### TEncoding

`TEncoding` _extends_ `BytesEncoding`

#### Parameters

##### encoding

`TEncoding`

##### string

`string`

#### Returns

`ConstantPdaSeedNode`\<`StringTypeNode`\<`TEncoding`, `undefined`\>, `StringValueNode`\>

#### Example

```ts
constantPdaSeedNodeFromString('utf8', 'tickets');
// Equivalent to:
constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('tickets'));
```
