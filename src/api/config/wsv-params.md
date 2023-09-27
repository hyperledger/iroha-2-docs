# World State View Parameters

[//]: # 'TODO Explain module'

## `wsv.asset_metadata_limits`

- **Type:** Table, [Metadata Limits](glossary#type-metadata-limits)
- **Default:** [Default Metadata Limits](glossary#default-metadata-limits)

**Example:**

```toml
[wsv.asset_metadata_limits]
max_len = 30
max_entry_byte_size = "2mb"
```

## `wsv.asset_definition_metadata_limits`

[//]: # 'TODO'

## `wsv.account_metadata_limits`

[//]: # 'TODO'

## `wsv.domain_metadata_limits`

[//]: # 'TODO'

## `wsv.ident_length_limits`

Limits for the number of characters in identifiers that can be stored in
the WSV.

[//]: # 'TODO: rename `ident` to something more readable? identifier?'

## `wsv.transaction_limits`

Limits that all transactions need to obey, in terms of size of WASM blob
and number of instructions.

## `wsv.wasm_runtime.fuel_limit`

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
[wsv.wasm_runtime]
fuel_limit = 40_000_000
```

## `wsv.wasm_runtime.max_memory`

Maximum amount of linear memory a given smart contract can allocate.

[//]: # 'TODO: transform table to list'

|          |                                                        |
| -------: | :----------------------------------------------------- |
|    Type: | String or Number, [Byte Size](glossary#type-byte-size) |
| Default: | `"500 MiB"`                                            |

Example:

```toml
[wsv.wasm_runtime]
max_memory = "1gb"
```
