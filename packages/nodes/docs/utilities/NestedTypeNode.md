# Nested type node helpers

## Functions

### assertIsNestedTypeNode()

> **assertIsNestedTypeNode**\<`TKind`\>(`node`, `kind`): `asserts node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>>`

Assertion guard that the final `TypeNode` of a nested type node is of the given kind or kinds.
`TKind` is the leaf type kind (or union of kinds) to assert and narrow the wrapped type to.
Throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NESTED_NODE_KIND` when the leaf does not match.

#### Type Parameters

##### TKind

`TKind` _extends_ `TypeNode`\[`"kind"`\]

#### Parameters

##### node

`Node` \| `null` \| `undefined`

##### kind

`TKind` \| `TKind`[]

#### Returns

`asserts node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>>`

#### Example

```ts
const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
assertIsNestedTypeNode(nestedNode, 'stringTypeNode'); // Ok
assertIsNestedTypeNode(nestedNode, 'numberTypeNode'); // Throws a CodamaError
```

---

### isNestedTypeNode()

> **isNestedTypeNode**\<`TKind`\>(`node`, `kind`): `node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>>`

Type guard that checks whether the final `TypeNode` of a nested type node is of the given kind or kinds.
`TKind` is the leaf type kind (or union of kinds) to match and narrow the wrapped type to.

#### Type Parameters

##### TKind

`TKind` _extends_ `TypeNode`\[`"kind"`\]

#### Parameters

##### node

`Node` \| `null` \| `undefined`

##### kind

`TKind` \| `TKind`[]

#### Returns

`node is NestedTypeNode<Extract<TypeNode, { kind: TKind }>>`

#### Example

```ts
const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
isNestedTypeNode(nestedNode, 'stringTypeNode'); // true
isNestedTypeNode(nestedNode, 'numberTypeNode'); // false
isNestedTypeNode(nestedNode, ['stringTypeNode', 'numberTypeNode']); // true
```

---

### resolveNestedTypeNode()

> **resolveNestedTypeNode**\<`TType`\>(`typeNode`): `TType`

Returns the final `TypeNode` wrapped inside a nested type node.
`TType` is the wrapped leaf type, so given a `NestedTypeNode<T>` it returns the `T`.

#### Type Parameters

##### TType

`TType` _extends_ `TypeNode`

#### Parameters

##### typeNode

`NestedTypeNode`\<`TType`\>

#### Returns

`TType`

#### Example

```ts
const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
resolveNestedTypeNode(nestedNode); // stringTypeNode('utf8')
```

---

### transformNestedTypeNode()

> **transformNestedTypeNode**\<`TFrom`, `TTo`\>(`typeNode`, `map`): `NestedTypeNode`\<`TTo`\>

Transforms the final `TypeNode` of a nested type node using the provided mapping function.
`TFrom` is the wrapped leaf type and `TTo` the mapped one, so a `NestedTypeNode<TFrom>` becomes a
`NestedTypeNode<TTo>` while preserving the surrounding wrappers.

#### Type Parameters

##### TFrom

`TFrom` _extends_ `TypeNode`

##### TTo

`TTo` _extends_ `TypeNode`

#### Parameters

##### typeNode

`NestedTypeNode`\<`TFrom`\>

##### map

(`type`) => `TTo`

#### Returns

`NestedTypeNode`\<`TTo`\>

#### Example

```ts
const nestedNode = fixedSizeTypeNode(stringTypeNode('utf8'), 10);
transformNestedTypeNode(nestedNode, () => stringTypeNode('base64'));
// fixedSizeTypeNode(stringTypeNode('base64'), 10)
```
