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

### isDecimal()

> **isDecimal**(`node`: `NumberTypeNode`): `boolean`

Returns true when the number type node encodes a floating-point decimal (`f32` or `f64`).

```ts
isDecimal(numberTypeNode('f32')); // true
isDecimal(numberTypeNode('u32')); // false
```

### isInteger()

> **isInteger**(`node`: `NumberTypeNode`): `boolean`

Returns true when the number type node encodes an integer, meaning any format that is not a float.

```ts
isInteger(numberTypeNode('u32')); // true
isInteger(numberTypeNode('f32')); // false
```

### isSignedInteger()

> **isSignedInteger**(`node`: `NumberTypeNode`): `boolean`

Returns true when the number type node encodes a signed integer (`i8`..`i128`).

```ts
isSignedInteger(numberTypeNode('i32')); // true
isSignedInteger(numberTypeNode('u32')); // false
```

### isUnsignedInteger()

> **isUnsignedInteger**(`node`: `NumberTypeNode`): `boolean`

Returns true when the number type node encodes an unsigned integer (`u8`..`u128` or `shortU16`).

```ts
isUnsignedInteger(numberTypeNode('u32')); // true
isUnsignedInteger(numberTypeNode('i32')); // false
```

## Examples

### Encoding `u32` integers

```typescript
numberTypeNode('u32');

// 5     => 0x00000000
// 42    => 0x2A000000
// 65535 => 0xFFFF0000
```

### Encoding `f32` big-endian decimal numbers

```typescript
numberTypeNode('f32', 'be');

// 1      => 0x3F800000
// -42    => 0xC2280000
// 3.1415 => 0x40490E56
```

### Encoding `shortU16` integers

```typescript
numberTypeNode('shortU16');

// 42    => 0x2A
// 128   => 0x8001
// 16384 => 0x808001
```
