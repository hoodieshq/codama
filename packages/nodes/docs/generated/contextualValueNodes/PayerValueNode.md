# `PayerValueNode`

Refers to the wallet paying for the surrounding transaction.

## Attributes

### Data

| Attribute | Type               | Description             |
| --------- | ------------------ | ----------------------- |
| `kind`    | `"payerValueNode"` | The node discriminator. |

## Functions

### `payerValueNode()`

Helper function that creates a `PayerValueNode` object.

```ts
const node = payerValueNode();
```

## Examples

### An instruction account defaulting to the payer value

```ts
instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'payer',
            isSigner: true,
            isWritable: false,
            defaultValue: payerValueNode(),
        }),
        // ...
    ],
});
```
