# Shared utilities

### camelCase()

> **camelCase**(`str`: `string`): `CamelCaseString`

Normalise an arbitrary string into camelCase by lowercasing the first character of its PascalCase form.

```ts
camelCase('my-cool_string'); // 'myCoolString'
```

### capitalize()

> **capitalize**(`str`: `string`): `string`

Uppercase the first character and lowercase the rest. Returns the input unchanged when it is empty.

```ts
capitalize('hello WORLD'); // 'Hello world'
```

### DocsInput

> **DocsInput** = `string[] | string`

Documentation input accepted by node helpers: either a single string or an array of strings.

### kebabCase()

> **kebabCase**(`str`: `string`): `KebabCaseString`

Normalise an arbitrary string into kebab-case, lowercase words joined with `-`, from its Title Case form.

```ts
kebabCase('MyCoolString'); // 'my-cool-string'
```

### parseDocs()

> **parseDocs**(`docs`: `DocsInput | null | undefined`): `Docs`

Normalise a `DocsInput` into a `Docs` array. Null or undefined becomes an empty array and a single string is wrapped.

```ts
parseDocs('A single line'); // ['A single line']
parseDocs(['Line one', 'Line two']); // ['Line one', 'Line two']
parseDocs(undefined); // []
```

### pascalCase()

> **pascalCase**(`str`: `string`): `PascalCaseString`

Normalise an arbitrary string into PascalCase by stripping the spaces from its Title Case form.

```ts
pascalCase('my-cool_string'); // 'MyCoolString'
```

### snakeCase()

> **snakeCase**(`str`: `string`): `SnakeCaseString`

Normalise an arbitrary string into snake*case, lowercase words joined with `*`, from its Title Case form.

```ts
snakeCase('MyCoolString'); // 'my_cool_string'
```

### titleCase()

> **titleCase**(`str`: `string`): `TitleCaseString`

Normalise an arbitrary string into Title Case, a space-separated sequence of capitalized words.
Inserts a space before each uppercase letter, splits on any run of non-alphanumeric characters and rejoins.

```ts
titleCase('my-cool_string'); // 'My Cool String'
```
