# `AccountBumpValueNode`

Refers to the bump seed of a named PDA-derived account in the surrounding instruction.

## Attributes

### Data

| Attribute | Type                     | Description                                            |
| --------- | ------------------------ | ------------------------------------------------------ |
| `kind`    | `"accountBumpValueNode"` | The node discriminator.                                |
| `name`    | `CamelCaseString`        | The name of the account whose bump seed is referenced. |

## Functions

### `accountBumpValueNode(name)`

Helper function that creates a `AccountBumpValueNode` object from the account name.

```ts
const node = accountBumpValueNode('associatedTokenAccount');
```

## Examples

### An instruction argument defaulting to the bump derivation of an instruction account

```ts
instructionNode({
    name: 'transfer',
    accounts: [
        instructionAccountNode({
            name: 'associatedTokenAccount',
            isSigner: false,
            isWritable: true,
        }),
        // ...
    ],
    arguments: [
        instructionArgumentNode({
            name: 'bump',
            type: numberTypeNode('u8'),
            defaultValue: accountBumpValueNode('associatedTokenAccount'),
        }),
        // ...
    ],
});
```
