# `AccountLinkNode`

A reference to an account defined elsewhere — possibly in a different program.

## Attributes

### Data

| Attribute | Type                | Description                         |
| --------- | ------------------- | ----------------------------------- |
| `kind`    | `"accountLinkNode"` | The node discriminator.             |
| `name`    | `CamelCaseString`   | The name of the referenced account. |

### Children

| Attribute | Type                                                   | Description                                                                                      |
| --------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `program` | [`ProgramLinkNode`](./ProgramLinkNode.md) _(optional)_ | The program the referenced account belongs to. When omitted, the surrounding program is assumed. |

## Functions

### `accountLinkNode(name, program?)`

Helper function that creates an `AccountLinkNode` object from the name of the `AccountNode` we are referring to. If the account is from another program, the `program` parameter must be provided as either a `string` or a `ProgramLinkNode`.

```ts
const node = accountLinkNode('myAccount');
const nodeFromAnotherProgram = accountLinkNode('myAccount', 'myOtherProgram');
```
