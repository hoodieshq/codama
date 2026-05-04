# Codama ➤ Dynamic Instructions

[![npm][npm-image]][npm-url]
[![npm-downloads][npm-downloads-image]][npm-url]

[npm-downloads-image]: https://img.shields.io/npm/dm/@codama/dynamic-instructions.svg?style=flat
[npm-image]: https://img.shields.io/npm/v/@codama/dynamic-instructions.svg?style=flat&label=%40codama%2Fdynamic-instructions
[npm-url]: https://www.npmjs.com/package/@codama/dynamic-instructions

This package provides a runtime Solana instruction builder that dynamically constructs `Instruction` (`@solana/instructions`). It provides instruction arguments encoding and validation, accounts resolution. Powers [`@codama/dynamic-client`](../dynamic-client/README.md) with `InstructionsBuilder`.

## Installation

```sh
pnpm install @codama/dynamic-instructions
```

> [!NOTE]
> This package is **not** included in the main [`codama`](../library) package.

## Functions

### `createInstructionsBuilder(root, ixNode)`

Creates an async instruction builder function for a given `InstructionNode`. The returned function validates inputs, resolves defaults, encodes arguments, and assembles the final `Instruction`.

```ts
const build = createInstructionsBuilder(root, ixNode);
const instruction = await build(args, accounts, signers, resolvers);
```

### `createAccountMeta(root, ixNode, argumentsInput?, accountsInput?, signers?, resolversInput?)`

Resolves and builds `AccountMeta[]` for an instruction. Handles PDA derivation, default value resolution, optional accounts, and signer disambiguation.

```ts
const accountMetas = await createAccountMeta(root, ixNode, args, accounts, ['owner'], resolvers);
```

### `encodeInstructionArguments(root, ixNode, argumentsInput?)`

Encodes instruction arguments into a `ReadonlyUint8Array` buffer according to the Codama schema. Auto-encodes arguments with `defaultValueStrategy: 'omitted'` (e.g., discriminators).

```ts
const data = encodeInstructionArguments(root, ixNode, { amount: 1_000_000_000 });
```

### `resolveArgumentDefaultsFromCustomResolvers(ixNode, argumentsInput?, accountsInput?, resolversInput?)`

For each argument with a `ResolverValueNode` that is not provided, invokes the corresponding user-supplied resolver function and fills the result into the arguments input.

```ts
const enrichedArgs = await resolveArgumentDefaultsFromCustomResolvers(ixNode, args, accounts, {
    resolveIsNonFungible: async (args, accounts) => args.tokenStandard === 'NonFungible',
});
```

## Utilities

### `toAddress(input)`

Converts any `AddressInput` to an `Address`:

```ts
import { toAddress } from '@codama/dynamic-instructions';

const addr = toAddress('11111111111111111111111111111111');
const addr2 = toAddress(legacyPublicKey);
```

### `isPublicKeyLike(value)`

Type guard for legacy `PublicKey` objects (duck-typed via `.toBase58()`):

```ts
import { isPublicKeyLike } from '@codama/dynamic-instructions';

if (isPublicKeyLike(value)) {
    const addr = toAddress(value);
}
```
