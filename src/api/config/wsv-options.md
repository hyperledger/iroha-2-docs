# World State View Options

Explain module

## `wsv.asset-metadata-limits`

- **Type:** Table, [Metadata Limits](glossary#type-metadata-limits)
- **Default:** [Default Metadata Limits](glossary#default-metadata-limits)

**Example:**

```toml
[wsv.asset-metadata-limits]
max-len = 30
max-entry-byte-size = "2mb"
```

## `wsv.asset-definition-metadata-limits`

TODO

## `wsv.account-metadata-limits`

TODO

## `wsv.domain-metadata-limits`

TODO

## `wsv.ident-length-limits`

Limits for the number of characters in identifiers that can be stored in
the WSV.

FIXME: rename `ident` to something more readable?

## `wsv.transaction-limits`

Limits that all transactions need to obey, in terms of size of WASM blob
and number of instructions.

## `wsv.wasm-runtime.fuel-limit`

The fuel limit determines the maximum number of instructions that can be
executed within a smart contract. Every WASM instruction costs
approximately 1 unit of fuel. See
[`wasmtime` reference](https://docs.rs/wasmtime/0.29.0/wasmtime/struct.Store.html#method.add-fuel)

|          |                |
| -------: | :------------- |
|    Type: | Number         |
| Default: | $23\ 000\ 000$ |

Example:

```toml
[wsv.wasm-runtime]
fuel-limit = 40_000_000
```

## `wsv.wasm-runtime.max-memory`

Maximum amount of linear memory a given smart contract can allocate.

|          |                                                |
| -------: | :--------------------------------------------- |
|    Type: | String or Number, [Byte Size](glossary#type-byte-size) |
| Default: | `"500 MiB"`                                    |

Example:

```toml
[wsv.wasm-runtime]
max-memory = "1gb"
```
