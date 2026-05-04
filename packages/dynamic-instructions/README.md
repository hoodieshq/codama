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

## Types generation

This package can generate per-instruction TypeScript types (`*Args`, `*Accounts`, `*Resolvers`) from a Codama IDL. The generated types can then be passed as generics to the functions below — and to [`resolveInstructionAccountAddress`](../dynamic-address-resolution/README.md#resolveinstructionaccountaddressinput) in `@codama/dynamic-address-resolution` — for end-to-end narrowing of arguments, accounts, and custom resolvers.

### CLI

```sh
npx @codama/dynamic-instructions generate-instruction-types ./idl/codama.json ./generated
```

Reads the Codama IDL JSON and writes a `<idl-name>-instruction-types.ts` file to the output directory.

### Programmatic

```ts
import { generateInstructionTypes } from '@codama/dynamic-instructions/codegen';
import { readFileSync, writeFileSync } from 'node:fs';
import { createFromJson } from 'codama';

const root = createFromJson(readFileSync('./idl/codama.json', 'utf-8')).getRoot();
writeFileSync('./generated/types.ts', generateInstructionTypes(root));
```

## Functions

### `createInstructionsBuilder(root, ixNode)`

Creates an async instruction builder function for a given `InstructionNode`. The returned function validates inputs, resolves defaults, encodes arguments, and assembles the final `Instruction`.

**Untyped:**

```ts
const build = createInstructionsBuilder(root, ixNode);
const instruction = await build(args, accounts, signers, resolvers);
```

**Typed:**

```ts
import type { CreateItemAccounts, CreateItemArgs, CreateItemResolvers } from './generated/types';

const build = createInstructionsBuilder<CreateItemArgs, CreateItemAccounts, [], CreateItemResolvers>(root, ixNode);
const instruction = await build({ name: 'item' }, { authority }, [], {
    resolveOwner: async (args, accounts) => accounts.authority,
});
```

Inside `resolveOwner`, `args` is `CreateItemArgs` and `accounts` is `CreateItemAccounts`.

### `createAccountMeta(root, ixNode, argumentsInput?, accountsInput?, signers?, resolversInput?)`

Resolves and builds `AccountMeta[]` for an instruction. Handles PDA derivation, default value resolution, optional accounts, and signer disambiguation.

**Untyped:**

```ts
const accountMetas = await createAccountMeta(root, ixNode, args, accounts, ['owner'], resolvers);
```

**Typed:**

```ts
import type { CreateItemAccounts, CreateItemArgs, CreateItemResolvers } from './generated/types';

const accountMetas = await createAccountMeta<CreateItemAccounts, CreateItemArgs, CreateItemResolvers>(
    root,
    ixNode,
    { name: 'item' },
    { authority },
    ['owner'],
    { resolveOwner: async (args, accounts) => accounts.authority },
);
```

### `encodeInstructionArguments(root, ixNode, argumentsInput?)`

Encodes instruction arguments into a `ReadonlyUint8Array` buffer according to the Codama schema. Auto-encodes arguments with `defaultValueStrategy: 'omitted'` (e.g. discriminators).

**Untyped:**

```ts
const data = encodeInstructionArguments(root, ixNode, { amount: 1_000_000_000 });
```

**Typed:**

```ts
import type { TransferArgs } from './generated/types';

const data = encodeInstructionArguments<TransferArgs>(root, ixNode, { amount: 1_000_000_000n });
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
