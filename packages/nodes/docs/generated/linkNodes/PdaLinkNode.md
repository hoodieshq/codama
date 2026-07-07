# `PdaLinkNode`

A reference to a PDA defined elsewhere — possibly in a different program.

## Attributes

### Data

| Attribute | Type              | Description                     |
| --------- | ----------------- | ------------------------------- |
| `kind`    | `"pdaLinkNode"`   | The node discriminator.         |
| `name`    | `CamelCaseString` | The name of the referenced PDA. |

### Children

| Attribute | Type                                                   | Description                                                                                  |
| --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `program` | [`ProgramLinkNode`](./ProgramLinkNode.md) _(optional)_ | The program the referenced PDA belongs to. When omitted, the surrounding program is assumed. |

## Functions

### `pdaLinkNode(name, program?)`

Helper function that creates a `PdaLinkNode` object from the name of the `PdaNode` we are referring to. If the PDA is from another program, the `program` parameter must be provided as either a `string` or a `ProgramLinkNode`.

```ts
const node = pdaLinkNode('myPda');
const nodeFromAnotherProgram = pdaLinkNode('myPda', 'myOtherProgram');
```
