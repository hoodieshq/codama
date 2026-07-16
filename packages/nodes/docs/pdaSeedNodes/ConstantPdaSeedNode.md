# `ConstantPdaSeedNode`

A PDA seed with a constant value (e.g. a UTF-8 string or a fixed byte sequence).

## Attributes

### Data

| Attribute | Type                    | Description             |
| --------- | ----------------------- | ----------------------- |
| `kind`    | `"constantPdaSeedNode"` | The node discriminator. |

### Children

| Attribute | Type                                                | Description                                                                                   |
| --------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `type`    | [`TypeNode`](../typeNodes/TypeNode.md)              | The type of the seed value.                                                                   |
| `value`   | [`ConstantPdaSeedValue`](./ConstantPdaSeedValue.md) | The constant value to use as the seed — either a literal value or the program ID placeholder. |

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

## Examples

### A PDA node with a UTF-8 constant seed

```typescript
pdaNode({
    name: 'tickets',
    seeds: [constantPdaSeedNodeFromString('utf8', 'tickets')],
});
```
