# `NumberTypeNode`

See the [`NumberTypeNode` specification](https://github.com/codama-idl/spec/blob/main/docs/typeNodes/NumberTypeNode.md).

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
