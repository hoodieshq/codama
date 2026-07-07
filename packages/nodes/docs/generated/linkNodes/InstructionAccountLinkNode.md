# `InstructionAccountLinkNode`

A reference to an account of another instruction.

## Attributes

### Data

| Attribute | Type                           | Description                                     |
| --------- | ------------------------------ | ----------------------------------------------- |
| `kind`    | `"instructionAccountLinkNode"` | The node discriminator.                         |
| `name`    | `CamelCaseString`              | The name of the referenced instruction account. |

### Children

| Attribute     | Type                                                           | Description                                                                                              |
| ------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `instruction` | [`InstructionLinkNode`](./InstructionLinkNode.md) _(optional)_ | The instruction the referenced account belongs to. When omitted, the surrounding instruction is assumed. |

## Functions

### `instructionAccountLinkNode(name, instruction?)`

Helper function that creates an `InstructionAccountLinkNode` object from the name of the `InstructionAccountNode` we are referring to. If the account is from another instruction, the `instruction` parameter must be provided as either a `string` or a `InstructionLinkNode`. When providing an `InstructionLinkNode`, we can also provide a `ProgramLinkNode` to point to a different program.

```ts
// Links to an account in the current instruction.
const node = instructionAccountLinkNode('myAccount');

// Links to an account in another instruction but within the same program.
const nodeFromAnotherInstruction = instructionAccountLinkNode('myAccount', 'myOtherInstruction');

// Links to an account in another instruction from another program.
const nodeFromAnotherProgram = instructionAccountLinkNode(
    'myAccount',
    instructionLinkNode('myOtherInstruction', 'myOtherProgram'),
);
```
