# `PdaSeedValueNode`

Pairs a PDA seed name with the value to substitute when deriving the PDA.

## Attributes

### Data

| Attribute | Type                 | Description                           |
| --------- | -------------------- | ------------------------------------- |
| `kind`    | `"pdaSeedValueNode"` | The node discriminator.               |
| `name`    | `CamelCaseString`    | The name of the seed being filled in. |

### Children

| Attribute | Type                                          | Description                           |
| --------- | --------------------------------------------- | ------------------------------------- |
| `value`   | [`PdaSeedValueValue`](./PdaSeedValueValue.md) | The value to substitute for the seed. |

## Functions

### `pdaSeedValueNode(name, value)`

Helper function that creates a `PdaSeedValueNode` object from the name of the variable seed and its value.

```ts
const node = pdaSeedValueNode('mint', accountValueNode('mint'));
```
