# Shared utilities

## Type Aliases

### DocsInput

> **DocsInput** = `string`[] \| `string`

Documentation input accepted by node helpers: either a single string or an array of strings.

## Functions

### camelCase()

> **camelCase**(`str`): `CamelCaseString`

Normalise an arbitrary string into camelCase by lowercasing the first character of its PascalCase form.

#### Parameters

##### str

`string`

#### Returns

`CamelCaseString`

#### Example

```ts
camelCase('my-cool_string'); // 'myCoolString'
```

---

### capitalize()

> **capitalize**(`str`): `string`

Uppercase the first character and lowercase the rest. Returns the input unchanged when it is empty.

#### Parameters

##### str

`string`

#### Returns

`string`

#### Example

```ts
capitalize('hello WORLD'); // 'Hello world'
```

---

### kebabCase()

> **kebabCase**(`str`): `KebabCaseString`

Normalise an arbitrary string into kebab-case, lowercase words joined with `-`, from its Title Case form.

#### Parameters

##### str

`string`

#### Returns

`KebabCaseString`

#### Example

```ts
kebabCase('MyCoolString'); // 'my-cool-string'
```

---

### parseDocs()

> **parseDocs**(`docs`): `Docs`

Normalise a `DocsInput` into a `Docs` array. Null or undefined becomes an empty array and a single string is wrapped.

#### Parameters

##### docs

[`DocsInput`](#docsinput) \| `null` \| `undefined`

#### Returns

`Docs`

#### Example

```ts
parseDocs('A single line'); // ['A single line']
parseDocs(['Line one', 'Line two']); // ['Line one', 'Line two']
parseDocs(undefined); // []
```

---

### pascalCase()

> **pascalCase**(`str`): `PascalCaseString`

Normalise an arbitrary string into PascalCase by stripping the spaces from its Title Case form.

#### Parameters

##### str

`string`

#### Returns

`PascalCaseString`

#### Example

```ts
pascalCase('my-cool_string'); // 'MyCoolString'
```

---

### snakeCase()

> **snakeCase**(`str`): `SnakeCaseString`

Normalise an arbitrary string into snake*case, lowercase words joined with `*`, from its Title Case form.

#### Parameters

##### str

`string`

#### Returns

`SnakeCaseString`

#### Example

```ts
snakeCase('MyCoolString'); // 'my_cool_string'
```

---

### titleCase()

> **titleCase**(`str`): `TitleCaseString`

Normalise an arbitrary string into Title Case, a space-separated sequence of capitalized words.
Inserts a space before each uppercase letter, splits on any run of non-alphanumeric characters and rejoins.

#### Parameters

##### str

`string`

#### Returns

`TitleCaseString`

#### Example

```ts
titleCase('my-cool_string'); // 'My Cool String'
```
