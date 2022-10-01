# Code snippets

Iroha development happens around three important branches:
[`dev`](https://github.com/hyperledger/iroha/tree/iroha2-dev),
[`stable`](https://github.com/hyperledger/iroha/tree/iroha2-stable), and
[`LTS`](https://github.com/hyperledger/iroha/tree/iroha2-lts).

With that in mind, documenting all the API versions manually has
limitations: at some point, the content in one of the branches will be
different compared to the documentation. Moreover, code in the
documentation may contain typos sometimes, and being able to run it won't
be guaranteed without testing. This raises questions about showing the
differences between branches for the new developers semi-automatically.

Our solution is to use a custom syntax in the code comments to mark the
snippets with the [dst-parser](https://github.com/soramitsu/dst-parser). We
configure URLs in a custom JSON config file and automatically query the
related URLs both on local builds and CI.

In addition, we're also using a custom
[markdown-it](https://github.com/markdown-it/markdown-it) plugin, so that
we can easily include the resulting snippets.

## Workflow

### Preparing the requirements

After you run `pnpm install`, a prebuilder script will run to ensure that
an output directory for the snippets (`src/snippets`) exists. It will also
download the snippets if those are not available.

Alternatively, you can run the prebuilder with the `pnpm run postinstall`
commands.

### Getting snippets

To download and convert the raw files, type: `pnpm run get_snippets`.

This will run a script that:

- downloads each snippet file in parallel
- parses them using a
  [dst-parser](https://www.npmjs.com/package/dst-parser) and extracts
  individual snippets
- exports the parsed snippets into the individual code files in the
  `src/snippets` directory
- exports the JSON metadata file (`meta.json`) into the same directory

The filename is formatted like this: `version_lang_name.extension`.

This approach allows attaching all the snippets by their names from the
custom component of the project's documentation system. This component is
implemented using [Vue](https://en.wikipedia.org/wiki/Vue.js), which is
already used in the [VitePress](https://vitepress.vuejs.org/) documentation
generator and is called with a custom Markdown syntax described below in
this article.

### Defining the sources for the documentation

To collect the code, we're using a custom [pnpm](https://pnpm.io/) script;
it reads a configuration list from a file named `snippet_sources.json` in
the documentation root, obtaining a list of items, each of which contains:

- `url`: the `URL` of a file to parse, it supports `http://`, `https://`,
  and relative file URLs, and it is mainly used for
  [GitHub](https://github.com/) raw files
- `lang`: a language to highlight using
  [Shiki](https://github.com/shikijs/shiki/)
- `version`: a branch or Iroha version (for example, `stable`, `dev`, or
  `lts`), which is used in file prefixes to distinguish between similar
  snippet names

Generally, we want two types of files to be used as documentation sources:

- raw sources from [GitHub](https://github.com/), because they are easy to
  parse and there's no additional markup
- source code files to use in this demo

Let's check the contents of the `snippet_sources.json` example:

```json
[
  {
    "version": "stable",
    "url": "https://raw.githubusercontent.com/username/project/stable/examples/filename.rs",
    "lang": "rust"
  },
  {
    "version": "dev",
    "url": "https://raw.githubusercontent.com/username/project/dev/examples/filename.rs",
    "lang": "rust"
  },
  {
    "version": "lts",
    "url": "https://raw.githubusercontent.com/username/project/lts/examples/filename.rs",
    "lang": "rust"
  }
]
```

We could have many source definitions[^1] inside this list, but each
definition, represented as a dictionary, is required to have the properties
displayed above: `version`, `url`, `lang`. At a later date, automatic
language detection may be added.

## Code comment syntax

Currently, the [dst-parser](https://github.com/soramitsu/dst-parser)
supports two comment formats: C-like (`//`) and Pythonic (`#`). Multiline
comments (`/* … */` and `""" … """`) are not parsed. The supported
languages are Rust, C, C++, Java, JavaScript, and Python.

A piece of code is considered a named fragment when it is located between
`// BEGIN FRAGMENT: <name>` and `// END FRAGMENT`, where `<>` signs are not
included. This syntax is case-sensitive. Names support alphanumeric
characters, underscores, minus signs, and white spaces.

Fragments can be included in one another. In that case, the lines matching
`// BEGIN FRAGMENT: <name>` and `// END FRAGMENT` are removed.

Elements between `// BEGIN ESCAPE` and `// END ESCAPE` are excluded
unconditionally from the tutorial.

While defining code documentation, you can use both underscores and white
spaces. It is preferable to use white spaces because they're used for
prefixing branch names.

The current version of the snippet collection script supports both normal
URLs and file paths[^2].

Considering the current design, specifically the layout and font
configuration, the optimal width for doc comments is 66 characters,
starting with a comment symbol(s). If there's common padding behind each
line, it is also removed. If the content is too long, it won't fit normally
and a scrollbar will appear.

## Using the custom Markdown syntax

With the [dst-parser](https://github.com/soramitsu/dst-parser) and
downloader doing their parts of the task, it is possible to import the
snippets. A single file that was added may contain more than one example.
The syntax may look like this:

```
::snippets
debug_rust_Lorem.rs
debug_typescript_Lorem.ts
::
```

For now, there's an
[issue](https://github.com/prettier/prettier/issues/13512) that requires an
override for a custom syntax, otherwise the formatting check and
autoformatting can't be used:

```
<!-- prettier-ignore -->
::snippets
debug_rust_Lorem.rs
debug_typescript_Lorem.ts
::

<!-- /prettier-ignore -->
```

In this example, our snippet files (`A.rs`, `B.py`, `C.js`) are located in
a default snippet directory: `src/snippets/`.

One can include the snippets from different directories for debugging
purposes if needed, using a path relative to the directory containing the
snippets:

```
<!-- prettier-ignore -->
::snippets
../alt_path/debug_java_Lorem.java
../alt_path/debug_python_Lorem.py
::

<!-- /prettier-ignore -->
```

The Markdown parser part is separated from the
[dst-parser](https://www.npmjs.com/package/dst-parser) so that each file is
not requested and parsed only a single time.

A [markdown-it](https://github.com/markdown-it/markdown-it) parser plugin
outputs a code for an internal
[Vue component](https://vuejs.org/guide/essentials/component-basics.html),
`SnippetTabs`. This plugin is based on a
[container](https://github.com/markdown-it/markdown-it-container) plugin.
It is called by [VitePress](https://vitepress.vuejs.org/) to display the
result.

This [markdown-it](https://github.com/markdown-it/markdown-it) plugin needs
the `meta.json` file mentioned above to add the metadata to the tabs and
the metadata can be extended.

## Demo

<!-- prettier-ignore -->
::snippets
debug_java_Lorem.java
debug_python_Lorem.py
debug_javascript_Lorem.js
debug_typescript_Lorem.ts
debug_rust_Lorem.rs
debug_shell_Lorem.sh
::

<!-- /prettier-ignore -->

## Troubleshooting

### Missing files

Sometimes, you may encounter an error while running documentation builds or
the development mode.

```
SnippetAccessError: Unable to read a file.
Ensure it exists, its location is correct and its access rights allow to read it.
Filename: "snippet_x.rs".
Directory path: "…src/snippets".
```

This error will be displayed with both the `pnpm run build` and
`pnpm run dev` commands. These details are necessary for the documentation
quality, so it won't build without such errors being resolved.

To resolve this error, rebuild the snippets with the
`pnpm run get_snippets` command. A new file should appear in
`src/snippets`.

If there is no new file, make sure that `snippet_sources.json` contains the
path to that snippet. Also, make sure the doc comment in the said file
matches the name in the snippet tabs definition.

## Internals

### Vue tab component

The custom component file that displays tabs is called `SnippetTabs.vue`.
It is located in the `.vitepress/theme/components/` directory.

```typescript
import SnippetTabs from './components/SnippetTabs.vue'
// …
export default {
  // …
  enhanceApp({ app }) {
    app.component('SnippetTabs', SnippetTabs)
  },
}
```

### Parser plugin integration

The Markdown parser section is enabled in `.vitepress/config.ts`, in the
`markdown` → `config` section:

```javascript
{
    markdown: {
        config(md) {
            md.use(footnote);
            snippets_plugin(md, {'snippet_root': resolve(__dirname, '../src/snippets/')})
        }
    }
}
```

Note that `snippet_root` directory path is required, otherwise the user has
to point out the paths.

[^1]: JSON dictionaries with `version`, `url`, and `lang` parameters
[^2]: which were only tested on Linux
