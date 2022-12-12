# Source Snippets

To make code snippets in the documentation more "real" and robust,
it is better to fetch them directly from the source files. The sources are located in other
repositories, where they are built, run, and tested.

## How it works

### Snippet Sources

Snippet sources are defined in
[`snippet_sources.json`](https://github.com/hyperledger/iroha-2-docs/blob/main/snippet_sources.json). The `snippet_sources.json` file is located
at the documentation repository root and has the following format:

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
- `filename` (optional) explicitly defines the local filename.

### Fetching Snippets

Code snippets are fetched from the locations specified in `snippet_sources.json` and
written into the `/src/snippets` directory. There are two ways to fetch the snippets:

- Automatically after packages installation (i.e. `pnpm install`)
- Manually by calling `pnpm get-snippets`

::: info

By default, snippets are deleted and reloaded each time
`pnpm get-snippets` is called. For local development it might be
more convenient to enable "lazy" behavior by calling
`pnpm get-snippets --force false`.

:::

### Using Snippets in Markdown

Use [Code Snippets feature in VitePress](https://vitepress.vuejs.org/guide/markdown#import-code-snippets) to include snippets into documentation:

**Input**

```md
<<<@/snippets/lorem.rs

<<<@/snippets/lorem.rs#ipsum
```

**Output**

<<<@/snippets/lorem.rs

<<<@/snippets/lorem.rs#ipsum

Note that we included only the `#ipsum` code region, not the entire file. This feature is
essential when it comes to including code from real source files into the
documentation.

## Example

Let's add a code snippet from Iroha JavaScript SDK. For example, this one: [`/packages/docs-recipes/src/1.client-install.ts`](https://github.com/hyperledger/iroha-javascript/blob/e300886e76c777776efad1e2f5cb245bfb8ed02e/packages/docs-recipes/src/1.client-install.ts).

1. First, get a permalink to the file. Open the file on GitHub and click `Raw` button to get the link.

- https://raw.githubusercontent.com/hyperledger/iroha-javascript/iroha2/packages/docs-recipes/src/1.client-install.ts

2. Define the new snippet in the [Snippet Sources](#snippet-sources):

```json
{
  "src": "https://raw.githubusercontent.com/hyperledger/iroha-javascript/iroha2/packages/docs-recipes/src/1.client-install.ts",
  "filename": "js-sdk-1-client-install.ts"
}
```

3. [Include](#using-snippets-in-markdown) the snippet in any Markdown
file in the documentation as follows:

**Input**

```md
<<<@/snippets/js-sdk-1-client-install.ts
```

**Output**

<<<@/snippets/js-sdk-1-client-install.ts
