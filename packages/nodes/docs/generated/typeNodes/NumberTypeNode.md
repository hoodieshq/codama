# `NumberTypeNode`

A numeric type with a fixed wire format and byte order.

## Attributes

### Data

| Attribute | Type               | Description             |
| --------- | ------------------ | ----------------------- |
| `kind`    | `"numberTypeNode"` | The node discriminator. |

### Children

| Attribute | Type                                                                     | Description                                              |
| --------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| `format`  | [`NumberFormat`](../sharedNodes/NumberFormat.md)                         | The wire format used to serialise the number.            |
| `endian`  | [`Endianness`](../sharedNodes/Endianness.md)                             | The byte order used to serialise the number.             |
| `display` | [`NumberDisplayNode`](../displayNodes/NumberDisplayNode.md) _(optional)_ | Display metadata describing how the number is presented. |

## Functions

### `numberTypeNode(format, endian)`

Helper function that creates a `NumberTypeNode` object from a provided format and endianess.

```ts
const littleEndianNode = numberTypeNode('u32'); // Little-endian by default.

const bigEndianNode = numberTypeNode('u32', 'be');
```

### `isSignedInteger(node)`

Checks if the provided `NumberTypeNode` represents a signed integer.

```ts
isSignedInteger(numberTypeNode('u32')); // false
isSignedInteger(numberTypeNode('i32')); // true
```

### `isUnsignedInteger(node)`

Checks if the provided `NumberTypeNode` represents an unsigned integer.

```ts
isUnsignedInteger(numberTypeNode('u32')); // true
isUnsignedInteger(numberTypeNode('i32')); // false
```

### `isInteger(node)`

Checks if the provided `NumberTypeNode` represents an integer.

```ts
isInteger(numberTypeNode('u32')); // true
isInteger(numberTypeNode('i32')); // true
isInteger(numberTypeNode('f32')); // false
```

### `isDecimal(node)`

Checks if the provided `NumberTypeNode` represents a decimal number.

```ts
isDecimal(numberTypeNode('u32')); // false
isDecimal(numberTypeNode('i32')); // false
isDecimal(numberTypeNode('f32')); // true
```

## Examples

### Encoding `u32` integers

```ts
numberTypeNode('u32');

// 5     => 0x00000000
// 42    => 0x2A000000
// 65535 => 0xFFFF0000
```

### Encoding `f32` big-endian decimal numbers

```ts
numberTypeNode('f32', 'be');

// 1      => 0x3F800000
// -42    => 0xC2280000
// 3.1415 => 0x40490E56
```

### Encoding `shortU16` integers

```ts
numberTypeNode('shortU16');

// 42    => 0x2A
// 128   => 0x8001
// 16384 => 0x808001
```
