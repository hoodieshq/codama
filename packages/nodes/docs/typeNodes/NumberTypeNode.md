# `NumberTypeNode`

See the [`NumberTypeNode` specification](https://github.com/codama-idl/spec/blob/main/docs/typeNodes/NumberTypeNode.md).

## Functions

### isDecimal()

> **isDecimal**(`node`): `boolean`

Returns true when the number type node encodes a floating-point decimal (`f32` or `f64`).

#### Parameters

##### node

`NumberTypeNode`

#### Returns

`boolean`

#### Example

```ts
isDecimal(numberTypeNode('f32')); // true
isDecimal(numberTypeNode('u32')); // false
```

---

### isInteger()

> **isInteger**(`node`): `boolean`

Returns true when the number type node encodes an integer, meaning any format that is not a float.

#### Parameters

##### node

`NumberTypeNode`

#### Returns

`boolean`

#### Example

```ts
isInteger(numberTypeNode('u32')); // true
isInteger(numberTypeNode('f32')); // false
```

---

### isSignedInteger()

> **isSignedInteger**(`node`): `boolean`

Returns true when the number type node encodes a signed integer (`i8`..`i128`).

#### Parameters

##### node

`NumberTypeNode`

#### Returns

`boolean`

#### Example

```ts
isSignedInteger(numberTypeNode('i32')); // true
isSignedInteger(numberTypeNode('u32')); // false
```

---

### isUnsignedInteger()

> **isUnsignedInteger**(`node`): `boolean`

Returns true when the number type node encodes an unsigned integer (`u8`..`u128` or `shortU16`).

#### Parameters

##### node

`NumberTypeNode`

#### Returns

`boolean`

#### Example

```ts
isUnsignedInteger(numberTypeNode('u32')); // true
isUnsignedInteger(numberTypeNode('i32')); // false
```
