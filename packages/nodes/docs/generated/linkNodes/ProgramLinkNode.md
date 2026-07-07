# `ProgramLinkNode`

A reference to a program by name.

## Attributes

### Data

| Attribute | Type                | Description                         |
| --------- | ------------------- | ----------------------------------- |
| `kind`    | `"programLinkNode"` | The node discriminator.             |
| `name`    | `CamelCaseString`   | The name of the referenced program. |

## Functions

### `programLinkNode(name)`

Helper function that creates a `ProgramLinkNode` object from the name of the `ProgramNode` we are referring to.

```ts
const node = programLinkNode('myProgram');
```
