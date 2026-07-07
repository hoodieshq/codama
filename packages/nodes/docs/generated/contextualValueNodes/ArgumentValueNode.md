# `ArgumentValueNode`

Refers to a named argument of the surrounding instruction.

## Attributes

### Data

| Attribute | Type                  | Description                          |
| --------- | --------------------- | ------------------------------------ |
| `kind`    | `"argumentValueNode"` | The node discriminator.              |
| `name`    | `CamelCaseString`     | The name of the referenced argument. |

## Functions

### `argumentValueNode(name)`

Helper function that creates a `ArgumentValueNode` object from the argument name.

```ts
const node = argumentValueNode('amount');
```

## Examples

### An instruction argument defaulting to another argument

```ts
instructionNode({
    name: 'mint',
    arguments: [
        instructionArgumentNode({
            name: 'amount',
            type: numberTypeNode('u64'),
        }),
        instructionArgumentNode({
            name: 'amountToDelegate',
            type: numberTypeNode('u64'),
            defaultValue: argumentValueNode('amount'),
        }),
        // ...
    ],
});
```
