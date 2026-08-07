# Node type guards

### assertIsNode()

> **assertIsNode**\<`TKind`\>(`node`: `Node | null | undefined`, `kind`: `TKind | TKind[]`): `asserts node is GetNodeFromKind<TKind>`

Assertion guard that narrows a node to the given kind or kinds.
`TKind` is the node kind (or union of kinds) to assert and narrow to via `GetNodeFromKind`.
Throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND` when the node does not match.

```ts
assertIsNode(numberTypeNode('u32'), 'numberTypeNode'); // Ok
assertIsNode(numberTypeNode('u32'), 'stringTypeNode'); // Throws a CodamaError
```

### assertIsNodeFilter()

> **assertIsNodeFilter**\<`TKind`\>(`kind`: `TKind | TKind[]`): `(node: Node | null | undefined) => node is GetNodeFromKind<TKind>`

Returns a predicate that asserts each node is of the given kind or kinds, suitable for `Array.filter`.
`TKind` is the node kind (or union of kinds) to assert and narrow to.
The predicate throws a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND` on any mismatch.

```ts
const numberNodes = nodes.filter(assertIsNodeFilter('numberTypeNode')); // Throws on a non-number node
```

### isNode()

> **isNode**\<`TKind`\>(`node`: `Node | null | undefined`, `kind`: `TKind | TKind[]`): `node is GetNodeFromKind<TKind>`

Type guard that narrows a node to the given kind or kinds.
`TKind` is the node kind (or union of kinds) to match and narrow to via `GetNodeFromKind`.
Returns false for null or undefined.

```ts
isNode(numberTypeNode('u32'), 'numberTypeNode'); // true
isNode(numberTypeNode('u32'), ['stringTypeNode', 'numberTypeNode']); // true
isNode(null, 'numberTypeNode'); // false
```

### isNodeFilter()

> **isNodeFilter**\<`TKind`\>(`kind`: `TKind | TKind[]`): `(node: Node | null | undefined) => node is GetNodeFromKind<TKind>`

Returns a predicate that narrows a node to the given kind or kinds, suitable for `Array.filter`.
`TKind` is the node kind (or union of kinds) the returned predicate matches and narrows to.

```ts
const numberNodes = nodes.filter(isNodeFilter('numberTypeNode'));
```

### removeNullAndAssertIsNodeFilter()

> **removeNullAndAssertIsNodeFilter**\<`TKind`\>(`kind`: `TKind | TKind[]`): `(node: Node | null | undefined) => node is GetNodeFromKind<TKind>`

Returns a predicate that drops null and undefined values and asserts the remaining nodes are of the given kind.
`TKind` is the node kind (or union of kinds) to assert and narrow to for non-nullish nodes.
Non-nullish nodes that do not match throw a `CodamaError` with code `CODAMA_ERROR__UNEXPECTED_NODE_KIND`.

```ts
const numberNodes = maybeNodes.filter(removeNullAndAssertIsNodeFilter('numberTypeNode'));
```
