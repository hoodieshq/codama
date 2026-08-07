# `InstructionNode`

See the [`InstructionNode` specification](https://github.com/codama-idl/spec/blob/main/docs/InstructionNode.md).

## Functions

### getAllInstructionArguments()

> **getAllInstructionArguments**(`node`: `InstructionNode`): `InstructionArgumentNode[]`

Returns all arguments of an instruction, including its extra arguments, as an `InstructionArgumentNode[]`.

```ts
const allArguments = getAllInstructionArguments(instruction);
```

### getAllInstructionsWithSubs()

> **getAllInstructionsWithSubs**(`node`: `InstructionNode | ProgramNode | RootNode`, `config`: `{ leavesOnly?: boolean; subInstructionsFirst?: boolean }`): `InstructionNode[]`

Returns all instructions with their nested sub-instructions. Accepts a `RootNode`, `ProgramNode` or
`InstructionNode`. With `leavesOnly` only the deepest instructions are returned and `subInstructionsFirst`
places sub-instructions before their parent.

```ts
const allInstructionsFromTheRoot = getAllInstructionsWithSubs(rootNode);
const leaves = getAllInstructionsWithSubs(programNode, { leavesOnly: true });
```

### parseOptionalAccountStrategy()

> **parseOptionalAccountStrategy**(`optionalAccountStrategy`: `OptionalAccountStrategy | undefined`): `OptionalAccountStrategy`

Normalises an optional account strategy, defaulting to `programId` when none is provided.

```ts
parseOptionalAccountStrategy(undefined); // 'programId'
parseOptionalAccountStrategy('omitted'); // 'omitted'
```
