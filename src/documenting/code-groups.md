# Code Groups

Iroha 2 Documentation includes a custom Markdown Extension in order to
support code groups. It is achieved with `:::code-group` container.

## Markdown Syntax

**Rules:**

- Each fence (a code block) within a `code-group` container is rendered as
  a tab;
- If a fence has a heading before it, then the heading content is used as a
  title. The heading could have any level (i.e. `#`, `##`, and so on);
- If a fence doesn't have a title, then its language is used as a title. If
  there is no language, then the title falls back to the `<block-#i>`
  placeholder.

**Input**

````md
:::code-group

```ts
type A = [string, string]
```

### I have a title

```rust
assert_eq!(vec![], vec![]);
```

```
Fence without lang or title
```

### Snippet syntax is supported as well

<<<@/snippets/lorem.rs#ipsum

:::
````

**Output**

:::code-group

```ts
type A = [string, string]
```

### I have a title

```rust
assert_eq!(vec![], vec![]);
```

```
Fence without lang or title
```

### Snippet syntax is supported as well

<<<@/snippets/lorem.rs#ipsum

:::

## HTML-based syntax

It is lower-level but might be used for advanced cases.

**Input**

````md
<CodeGroup :blocks="2" :langs="{ 1: 'rs' }">

<template #block-0-title> <span class="line-through">Lorem</span> ipsum
</template>

<template #block-0>

```
Lorem ipsum dolor sit ament
```

</template>

<template #block-1>

```rs
struct New;
```

</template>

</CodeGroup>
````

**Output**

<CodeGroup :blocks="2" :langs="{ 1: 'rs' }">

<template #block-0-title> <span class="line-through">Lorem</span> ipsum
</template>

<template #block-0>

```
Lorem ipsum dolor sit ament
```

</template>

<template #block-1>

```rs
struct New;
```

</template>

</CodeGroup>

HTML syntax might be combined with `:::code-group` as well:

**Input**

````md
:::code-group

<template #block-0-title> <span class="text-red-400">How</span>
<span class="text-green-400"> are </span>
<span class="text-blue-400">you?</span> </template>

```elixir
case mood do
  :ok -> "fine!"
  :not_really_ok -> "stay strong!"
end
```

:::
````

**Output**

:::code-group

<template #block-0-title> <span class="text-red-400">How</span>
<span class="text-green-400"> are </span>
<span class="text-blue-400">you?</span> </template>

```elixir
case mood do
  :ok -> "fine!"
  :not_really_ok -> "stay strong!"
end
```

:::
