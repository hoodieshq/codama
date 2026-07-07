# `PdaNode`

A program-derived address: its name, optional program ID override, and the seeds used to derive it.

![Diagram](https://github.com/codama-idl/codama/assets/3642397/4f7c9718-1ffa-4f2c-aa45-71b3ce204219)

## Attributes

### Data

| Attribute   | Type                    | Description                                                                                             |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `kind`      | `"pdaNode"`             | The node discriminator.                                                                                 |
| `name`      | `CamelCaseString`       | The name of the PDA.                                                                                    |
| `docs`      | `string[]` _(optional)_ | Markdown documentation for the PDA.                                                                     |
| `programId` | `Address` _(optional)_  | The base58-encoded program ID used to derive the PDA. When omitted, the surrounding program is assumed. |

### Children

| Attribute | Type                                             | Description                                 |
| --------- | ------------------------------------------------ | ------------------------------------------- |
| `seeds`   | [`PdaSeedNode`](./pdaSeedNodes/PdaSeedNode.md)[] | The seeds used to derive the PDA, in order. |

## Functions

### `pdaNode(input)`

Helper function that creates a `pdaNode` object from an input object.

```ts
const node = pdaNode({
    name: 'counter',
    seeds: [variablePdaSeedNode('authority', publicKeyTypeNode())],
    docs: ['The counter PDA derived from its authority.'],
});
```

## Examples

### A PDA with constant and variable seeds

```ts
pdaNode({
    name: 'ticket',
    seeds: [
        constantPdaSeedNodeFromString('utf8', 'raffles'),
        variablePdaSeedNode('raffle', publicKeyTypeNode()),
        constantPdaSeedNodeFromString('utf8', 'tickets'),
        variablePdaSeedNode('ticketNumber', numberTypeNode('u32')),
    ],
});
```

### A PDA with no seeds

```ts
pdaNode({
    name: 'seedlessPda',
    seeds: [],
});
```
