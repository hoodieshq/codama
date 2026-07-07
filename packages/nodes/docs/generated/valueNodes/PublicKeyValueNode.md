# `PublicKeyValueNode`

A concrete public key, with an optional symbolic identifier for the address.

## Attributes

### Data

| Attribute    | Type                           | Description                                                       |
| ------------ | ------------------------------ | ----------------------------------------------------------------- |
| `kind`       | `"publicKeyValueNode"`         | The node discriminator.                                           |
| `publicKey`  | `Address`                      | The base58-encoded public key.                                    |
| `identifier` | `CamelCaseString` _(optional)_ | A symbolic name for the address, useful in generated client code. |

## Functions

### `publicKeyValueNode(publicKey, identifier?)`

Helper function that creates a `PublicKeyValueNode` object from a base58 encoded public key and an optional identifier.

```ts
const node = publicKeyValueNode('7rA1KcBdW5hKmMasQdRVBFsD6T1nLtYuR6y59TJNgevR');
```
