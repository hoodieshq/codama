# `VariablePdaSeedNode`

A PDA seed whose value is provided at derivation time, identified by name.

## Attributes

### Data

| Attribute | Type                    | Description                                   |
| --------- | ----------------------- | --------------------------------------------- |
| `kind`    | `"variablePdaSeedNode"` | The node discriminator.                       |
| `name`    | `CamelCaseString`       | The name of the seed variable.                |
| `docs`    | `string[]` _(optional)_ | Markdown documentation for the seed variable. |

### Children

| Attribute | Type                                   | Description                          |
| --------- | -------------------------------------- | ------------------------------------ |
| `type`    | [`TypeNode`](../typeNodes/TypeNode.md) | The expected type of the seed value. |

## Functions

### `variablePdaSeedNode(name, type, docs?)`

Helper function that creates a `VariablePdaSeedNode` object from a name, a type node and optional documentation.

```ts
const node = variablePdaSeedNode('amount', numberTypeNode('u32'));
```

## Examples

### A PDA node with a public key variable seed

```ts
pdaNode({
    name: 'ticket',
    seeds: [variablePdaSeedNode('authority', publicKeyTypeNode())],
});
```
