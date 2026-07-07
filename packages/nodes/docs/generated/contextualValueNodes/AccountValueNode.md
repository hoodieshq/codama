# `AccountValueNode`

Refers to a named account in the surrounding instruction.

## Attributes

### Data

| Attribute | Type                 | Description                         |
| --------- | -------------------- | ----------------------------------- |
| `kind`    | `"accountValueNode"` | The node discriminator.             |
| `name`    | `CamelCaseString`    | The name of the referenced account. |

## Functions

### `accountValueNode(name)`

Helper function that creates a `AccountValueNode` object from the account name.

```ts
const node = accountValueNode('mint');
```

## Examples

### An instruction account defaulting to another account

```ts
instructionNode({
    name: 'mint',
    accounts: [
        instructionAccountNode({
            name: 'payer',
            isSigner: true,
            isWritable: false,
        }),
        instructionAccountNode({
            name: 'authority',
            isSigner: false,
            isWritable: true,
            defaultValue: accountValueNode('payer'),
        }),
        // ...
    ],
});
```
