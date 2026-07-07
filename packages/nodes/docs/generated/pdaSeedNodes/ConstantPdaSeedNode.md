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

### `constantPdaSeedNode(type, value)`

Helper function that creates a `ConstantPdaSeedNode` object from a type node and a value node.

```ts
const node = constantPdaSeedNode(numberTypeNode('u32'), numberValueNode(42));
```

### `constantPdaSeedNodeFromString(encoding, data)`

Helper function that creates a `ConstantPdaSeedNode` object of type `StringTypeNode` from an encoding and a string of data.

```ts
constantPdaSeedNodeFromString('utf8', 'Hello');

// Equivalent to:
constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('Hello'));
```

### `constantValueNodeFromBytes(encoding, data)`

Helper function that creates a `ConstantValueNode` object of type `BytesTypeNode` from an encoding and a string of data.

```ts
constantValueNodeFromBytes('base16', 'FF99CC');

// Equivalent to:
constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
```

## Examples

### A PDA node with a UTF-8 constant seed

```ts
pdaNode({
    name: 'tickets',
    seeds: [constantPdaSeedNodeFromString('utf8', 'tickets')],
});
```
