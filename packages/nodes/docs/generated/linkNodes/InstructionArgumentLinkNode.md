# `InstructionArgumentLinkNode`

A reference to an argument of another instruction.

## Attributes

### Data

| Attribute | Type                            | Description                                      |
| --------- | ------------------------------- | ------------------------------------------------ |
| `kind`    | `"instructionArgumentLinkNode"` | The node discriminator.                          |
| `name`    | `CamelCaseString`               | The name of the referenced instruction argument. |

### Children

| Attribute     | Type                                                           | Description                                                                                               |
| ------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `instruction` | [`InstructionLinkNode`](./InstructionLinkNode.md) _(optional)_ | The instruction the referenced argument belongs to. When omitted, the surrounding instruction is assumed. |

## Functions

### `instructionArgumentLinkNode(name, instruction?)`

Helper function that creates an `InstructionArgumentLinkNode` object from the name of the `InstructionArgumentNode` we are referring to. If the argument is from another instruction, the `instruction` parameter must be provided as either a `string` or a `InstructionLinkNode`. When providing an `InstructionLinkNode`, we can also provide a `ProgramLinkNode` to point to a different program.

```ts
// Links to an argument in the current instruction.
const node = instructionArgumentLinkNode('myArgument');

// Links to an argument in another instruction but within the same program.
const nodeFromAnotherInstruction = instructionArgumentLinkNode('myArgument', 'myOtherInstruction');

// Links to an argument in another instruction from another program.
const nodeFromAnotherProgram = instructionArgumentLinkNode(
    'myArgument',
    instructionLinkNode('myOtherInstruction', 'myOtherProgram'),
);
```
