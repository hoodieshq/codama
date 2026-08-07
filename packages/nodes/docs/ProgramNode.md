# `ProgramNode`

See the [`ProgramNode` specification](https://github.com/codama-idl/spec/blob/main/docs/ProgramNode.md).

## Functions

### getAllAccounts()

> **getAllAccounts**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `AccountNode[]`

Returns all `AccountNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allAccounts = getAllAccounts(rootNode);
```

### getAllConstants()

> **getAllConstants**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `ConstantNode[]`

Returns all `ConstantNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allConstants = getAllConstants(rootNode);
```

### getAllDefinedTypes()

> **getAllDefinedTypes**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `DefinedTypeNode[]`

Returns all `DefinedTypeNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
`ProgramNode`.

```ts
const allDefinedTypes = getAllDefinedTypes(rootNode);
```

### getAllErrors()

> **getAllErrors**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `ErrorNode[]`

Returns all `ErrorNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allErrors = getAllErrors(rootNode);
```

### getAllEvents()

> **getAllEvents**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `EventNode[]`

Returns all `EventNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allEvents = getAllEvents(rootNode);
```

### getAllInstructions()

> **getAllInstructions**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `InstructionNode[]`

Returns all `InstructionNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of
`ProgramNode`.

```ts
const allInstructions = getAllInstructions(rootNode);
```

### getAllPdas()

> **getAllPdas**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `PdaNode[]`

Returns all `PdaNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allPdas = getAllPdas(rootNode);
```

### getAllPrograms()

> **getAllPrograms**(`node`: `ProgramNode | ProgramNode[] | RootNode`): `ProgramNode[]`

Returns all `ProgramNodes` under a given node. Accepts a `RootNode`, a `ProgramNode` (returned as a
single-element array) or an array of `ProgramNode`.

```ts
const allPrograms = getAllPrograms(rootNode);
```
