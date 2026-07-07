# `ConstantValueNode`

A typed constant: a type node paired with a concrete value node.

## Attributes

### Data

| Attribute | Type                  | Description             |
| --------- | --------------------- | ----------------------- |
| `kind`    | `"constantValueNode"` | The node discriminator. |

### Children

| Attribute | Type                                   | Description                         |
| --------- | -------------------------------------- | ----------------------------------- |
| `type`    | [`TypeNode`](../typeNodes/TypeNode.md) | The type of the constant.           |
| `value`   | [`ValueNode`](./ValueNode.md)          | The concrete value of the constant. |

## Functions

### `constantValueNode(type, value)`

Helper function that creates a `ConstantValueNode` object from a type and a value node

```ts
const node = constantValueNode(numberTypeNode('u32'), numberValueNode(42));
```

### `constantValueNodeFromString(encoding, data)`

Helper function that creates a `ConstantValueNode` object of type `StringTypeNode` from an encoding and a string of data.

```ts
constantValueNodeFromString('utf8', 'Hello');

// Equivalent to:
constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello'));
```

### `constantValueNodeFromBytes(encoding, data)`

Helper function that creates a `ConstantValueNode` object of type `BytesTypeNode` from an encoding and a string of data.

```ts
constantValueNodeFromBytes('base16', 'FF99CC');

// Equivalent to:
constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
```
