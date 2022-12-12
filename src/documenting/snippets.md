# Source Snippets

In order to make code snippets in the documentation more "real" and robust,
they might be included directly from the source files, located in other
repos, that are built, run and tested.

## How it works

### Snippet Sources

Snippet sources are defined at the
[`snippet_sources.json`](https://github.com/hyperledger/iroha-2-docs/blob/main/snippet_sources.json)
at the documentation repository root. Itss format is the following:

```json
[
  {
    "src": "https://raw.githubusercontent.com/hyperledger/iroha/iroha2-stable/MAINTAINERS.md",
    "filename": "iroha-maintainers-at-stable.md"
  },
  {
    "src": "./src/example_code/lorem.rs"
  }
]
```

- `src` defines the source file location and could be either an HTTP(s) URI
  or a relative file path.
- `filename` (optional) explicitly defines the local filename

### Fetching Snippets

According to the `snippet_sources.json`, the snippets are fetched and
written into the `/src/snippets` directory. It happens in several cases:

- Automatically after packages installation (i.e. `pnpm install`)
- Manually by calling `pnpm get-snippets`

::: info

By default, snippets are deleted and reloaded each time when
`pnpm get-snippets` is called. Sometimes in local development it might be
more convenient to enable "lazy" behavior by calling
`pnpm get-snippets --force false`

:::

### Using Snippets in Markdown

Snippets might be included into the documentation source using VitePress'
[Code Snippets](https://vitepress.vuejs.org/guide/markdown#import-code-snippets)
feature:

**Input**

```md
<<<@/snippets/lorem.rs

<<<@/snippets/lorem.rs#ipsum
```

**Output**

<<<@/snippets/lorem.rs

<<<@/snippets/lorem.rs#ipsum

Pay attention to how we included only `#ipsum` code region. This feature is
essential when it comes to including real source files content into the
documentation.

## Example

Let's add a code snippets from the Iroha JavaScript SDK, for example
[`/packages/docs-recipes/src/1.client-install.ts`](https://github.com/hyperledger/iroha-javascript/blob/e300886e76c777776efad1e2f5cb245bfb8ed02e/packages/docs-recipes/src/1.client-install.ts).
To do so, the first thing we need is to get a permalink to the file.
Clicking by the "Raw" button at GitHub, we got it:

- https://raw.githubusercontent.com/hyperledger/iroha-javascript/iroha2/packages/docs-recipes/src/1.client-install.ts

Then, we define the new snippet in the [Snippet Sources](#snippet-sources):

```json
{
  "src": "https://raw.githubusercontent.com/hyperledger/iroha-javascript/iroha2/packages/docs-recipes/src/1.client-install.ts",
  "filename": "js-sdk-1-client-install.ts"
}
```

Then, it can be [included](#using-snippets-in-markdown) in any Markdown
file in the documentation as follows:

**Input**

```md
<<<@/snippets/js-sdk-1-client-install.ts
```

**Output**

<<<@/snippets/js-sdk-1-client-install.ts
