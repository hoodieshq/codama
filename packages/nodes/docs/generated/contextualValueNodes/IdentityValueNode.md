# `IdentityValueNode`

Refers to the wallet identity providing the instruction context.

## Attributes

### Data

| Attribute | Type                  | Description             |
| --------- | --------------------- | ----------------------- |
| `kind`    | `"identityValueNode"` | The node discriminator. |

## Functions

### `identityValueNode()`

Helper function that creates a `IdentityValueNode` object.

```ts
const node = identityValueNode();
```

## Examples

### An instruction account defaulting to the identity value

```ts
instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'authority',
            isSigner: true,
            isWritable: false,
            defaultValue: identityValueNode(),
        }),
        // ...
    ],
});
```
