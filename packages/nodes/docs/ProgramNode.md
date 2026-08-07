# `ProgramNode`

See the [`ProgramNode` specification](https://github.com/codama-idl/spec/blob/main/docs/ProgramNode.md).

## Functions

### getAllAccounts()

> **getAllAccounts**(`node`): `AccountNode`[]

Returns all `AccountNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`AccountNode`[]

#### Example

```ts
const allAccounts = getAllAccounts(rootNode);
```

---

### getAllConstants()

> **getAllConstants**(`node`): `ConstantNode`[]

Returns all `ConstantNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`ConstantNode`[]

#### Example

```ts
const allConstants = getAllConstants(rootNode);
```

---

### getAllDefinedTypes()

> **getAllDefinedTypes**(`node`): `DefinedTypeNode`[]

Returns all `DefinedTypeNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
`ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`DefinedTypeNode`[]

#### Example

```ts
const allDefinedTypes = getAllDefinedTypes(rootNode);
```

---

### getAllErrors()

> **getAllErrors**(`node`): `ErrorNode`[]

Returns all `ErrorNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`ErrorNode`[]

#### Example

```ts
const allErrors = getAllErrors(rootNode);
```

---

### getAllEvents()

> **getAllEvents**(`node`): `EventNode`[]

Returns all `EventNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`EventNode`[]

#### Example

```ts
const allEvents = getAllEvents(rootNode);
```

---

### getAllInstructions()

> **getAllInstructions**(`node`): `InstructionNode`[]

Returns all `InstructionNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
`ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`InstructionNode`[]

#### Example

```ts
const allInstructions = getAllInstructions(rootNode);
```

---

### getAllPdas()

> **getAllPdas**(`node`): `PdaNode`[]

Returns all `PdaNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`PdaNode`[]

#### Example

```ts
const allPdas = getAllPdas(rootNode);
```

---

### getAllPrograms()

> **getAllPrograms**(`node`): `ProgramNode`[]

Returns all `ProgramNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` (returned as a
single-element array) or an array of `ProgramNode`.

#### Parameters

##### node

`ProgramNode` \| `ProgramNode`[] \| `RootNode`

#### Returns

`ProgramNode`[]

#### Example

```ts
const allPrograms = getAllPrograms(rootNode);
```
