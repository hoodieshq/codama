# `ProgramNode`

A Solana program: its identity, version, accounts, instructions, defined types, PDAs, events, errors, and constants.

![Diagram](https://github.com/codama-idl/codama/assets/3642397/37ec38ea-66df-4c08-81c3-822ef4388580)

## Attributes

### Data

| Attribute   | Type                    | Description                                 |
| ----------- | ----------------------- | ------------------------------------------- |
| `kind`      | `"programNode"`         | The node discriminator.                     |
| `name`      | `CamelCaseString`       | The name of the program.                    |
| `publicKey` | `Address`               | The base58-encoded program ID.              |
| `version`   | `SemverString`          | The version of the program, in semver form. |
| `docs`      | `string[]` _(optional)_ | Markdown documentation for the program.     |

### Children

| Attribute      | Type                                                           | Description                                                                |
| -------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `origin`       | [`ProgramOrigin`](./sharedNodes/ProgramOrigin.md) _(optional)_ | The toolchain that originally generated the program description, if known. |
| `accounts`     | [`AccountNode`](./AccountNode.md)[]                            | The accounts owned by the program.                                         |
| `instructions` | [`InstructionNode`](./InstructionNode.md)[]                    | The instructions exposed by the program.                                   |
| `definedTypes` | [`DefinedTypeNode`](./DefinedTypeNode.md)[]                    | The reusable types defined by the program.                                 |
| `pdas`         | [`PdaNode`](./PdaNode.md)[]                                    | The PDAs derived by the program.                                           |
| `events`       | [`EventNode`](./EventNode.md)[]                                | The events emitted by the program.                                         |
| `errors`       | [`ErrorNode`](./ErrorNode.md)[]                                | The errors returned by the program.                                        |
| `constants`    | [`ConstantNode`](./ConstantNode.md)[]                          | The constants exposed by the program.                                      |

## Functions

### `programNode(input)`

Helper function that creates a `ProgramNode` object from an input object

```ts
const node = programNode({
    name: 'counter',
    publicKey: '7ovtg4pFqjQdSwFAUCu8gTnh5thZHzAyJFXy3Ssnj3yK',
    version: '1.42.6',
    accounts: [],
    instructions: [],
    definedTypes: [],
    pdas: [],
    events: [],
    errors: [],
});
```

### `getAllPrograms(node)`

Helper function that returns all `ProgramNodes` under a given node. This can be a `RootNode`, a `ProgramNode` — returning itself in an array — or an array of `ProgramNode`.

```ts
const allPrograms = getAllPrograms(rootNode);
```

### `getAllPdas(node)`

Helper function that returns all `PdaNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allPdas = getAllPdas(rootNode);
```

### `getAllAccounts(node)`

Helper function that returns all `AccountNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allAccounts = getAllAccounts(rootNode);
```

### `getAllEvents(node)`

Helper function that returns all `EventNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allEvents = getAllEvents(rootNode);
```

### `getAllDefinedTypes(node)`

Helper function that returns all `DefinedTypeNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allDefinedTypes = getAllDefinedTypes(rootNode);
```

### `getAllInstructions(node)`

Helper function that returns all `InstructionNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allInstructions = getAllInstructions(rootNode);
```

### `getAllErrors(node)`

Helper function that returns all `ErrorNodes` under a given node. This can be a `RootNode`, a `ProgramNode` or an array of `ProgramNode`.

```ts
const allErrors = getAllErrors(rootNode);
```
