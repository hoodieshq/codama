# `ConstantValueNode`

See the [`ConstantValueNode` specification](https://github.com/codama-idl/spec/blob/main/docs/valueNodes/ConstantValueNode.md).

## Functions

### constantValueNodeFromBytes()

> **constantValueNodeFromBytes**\<`TEncoding`\>(`encoding`, `data`): `ConstantValueNode`\<`BytesTypeNode`, `BytesValueNode`\>

Creates a `ConstantValueNode` of type `BytesTypeNode` from an encoding and a string of data.

#### Type Parameters

##### TEncoding

`TEncoding` _extends_ `BytesEncoding`

#### Parameters

##### encoding

`TEncoding`

##### data

`string`

#### Returns

`ConstantValueNode`\<`BytesTypeNode`, `BytesValueNode`\>

#### Example

```ts
constantValueNodeFromBytes('base16', 'FF99CC');
// Equivalent to:
constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
```

---

### constantValueNodeFromString()

> **constantValueNodeFromString**\<`TEncoding`\>(`encoding`, `string`): `ConstantValueNode`\<`StringTypeNode`\<`TEncoding`, `undefined`\>, `StringValueNode`\>

Creates a `ConstantValueNode` of type `StringTypeNode` from an encoding and a string of data.

#### Type Parameters

##### TEncoding

`TEncoding` _extends_ `BytesEncoding`

#### Parameters

##### encoding

`TEncoding`

##### string

`string`

#### Returns

`ConstantValueNode`\<`StringTypeNode`\<`TEncoding`, `undefined`\>, `StringValueNode`\>

#### Example

```ts
constantValueNodeFromString('utf8', 'Hello');
// Equivalent to:
constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello'));
```
