# Configuration Reference

::: warning WORK IN PROGRESS

It is not implemented yet. Early draft document according to the RFC.

:::

## Table of Contents

[[toc]]

## TODO

- [ ] [Transpose tables](https://github.com/rollup/rollup/blob/master/docs/.vitepress/transpose-tables.ts)
- [ ] Consider refining `Number` types to exact `Integer`, `Float`,
      `Unsigned 64-bits integer`?
- [ ] Consider adding mathjax to render default values like `2 ** 16` nicer
- [ ] Explain "actor channel capacity" for users. What are actors, how to
      configure them. Maybe give some insight about each actor in
      particular.
- [ ] Is `sumeragi.trusted-peers` optional or required?
- [ ] Use `torii.fetch-amount` instead of `torii.fetch-size`. IMO size is
      better to preserve for "byte size". Same for
      `sumeragi.gossip-batch-size`, `block-sync.block-batch-size`.
- [ ] Define more ENVs

## How it works

How resolved: file, then ENV, then default values.

File might be set either with `IROHA_CONFIG` env var:

```bash
$ export IROHA_CONFIG=~/iroha.toml
$ iroha
```

Or with [`--config`](./cli#config) CLI argument:

```bash
$ iroha --config ./config.toml
```

::: tip

To trace how configuration is resolved, run Iroha with
[`--trace-config`](./cli#trace-config) flag:

```bash
$ iroha -c ./config.toml --trace-config
```

The output will be something like:

```
TODO: sample output
```

TODO: probably put extended information under the
[`--trace-config`](./cli#trace-config) CLI flag documentation in CLI
section

:::

### TOML Format

TODO: brief explanation of the format, links to guides/specs

## Minimal Configuration

Required fields are:

- [`public-key`](#public-key)
- [`private-key`](#private-key)
- [`genesis.public-key`](#genesis-public-key)
- [`genesis.private-key`](#genesis-private-key) if the peer is the one who
  submits the genesis
- [`network.address`](#network-address)
- [`sumeragi.trusted-peers`](#sumeragi-trusted-peers) (?)
- [`torii.api-address`](#torii-api-address)

Minimal configuration looks like:

```toml
# key pair of the peer itself
public-key = ""
private-key = {}

[network]
# address for peer-to-peer communication
address = "localhost:1337"

# list of the trusted peers

[[sumeragi.trusted-peers]]
address = ""
public-key = ""

[[sumeragi.trusted-peers]]
address = ""
public-key = ""

[torii]
# address for the API endpoint
api-address = "localhost:8080"
```

## Base Options

### `public-key`

- **Type:** String, [Multi-hash](#type-multi-hash)
- **Required**

Public key of this peer

```toml
[iroha]
public-key = ""
```

### `private-key`

- **Type:** Table, [Private Key](#type-private-key)
- **Required**

Private key of this peer

```toml
[iroha]
private-key = { digest = "", payload = "" }
```

## Genesis Options

Explain the purpose of this block. Maybe explain both keys in a single
section?

#### `genesis.public-key`

- **Type:** [Multi-hash](#type-multi-hash)
- **Required**

The public key of the genesis account, should be supplied to all peers.

#### `genesis.private-key`

- **Type:** Table, [Private Key](#type-private-key)
- **Required** if the configured peer submits the genesis block, and
  **optional** otherwise

The private key of the genesis account, only needed for the peer that
submits the genesis block.

::: info

This parameter is required if the peer being configured submits the
genesis, i.e. if it is run with [`--submit-genesis`](./cli#submit-genesis)
(todo link) CLI argument.

:::

::: warning

The warning will be printed if
[`genesis.private-key`](#genesis-private-key) and
[`--submit-genesis`](./cli#submit-genesis) are used without each other.

:::

## Network Options

Explain network module

### `network.address`

- **Type:** String, [Socket-Address](#type-socket-address)
- **Required**

address for p2p communication for consensus and block synchronization
purposes.

::: tip

This address is what other peers should specify in their
[`sumeragi.trusted-peers`](#sumeragi-trusted-peers)

:::

### `network.actor-channel-capacity`

- **Type:** Number
- **Default:** 100

See: [Actor Channel Capacity](#actor-channel-capacity)

## Sumeragi Options

Explain sumeragi module

### `sumeragi.trusted-peers`

- **Type:** Array of Peer Ids

Optional _(?)_ list of predefined trusted peers.

Peer Id:

- `address` - String, [Socket-Address](#type-socket-address)
- `public-key` - [Multi-hash](#type-multi-hash)

```toml
peer-id = { address = "", public-key = "" }
```

Define an array in two ways

```toml
[[sumeragi.trusted-peers]]
address = "1"
public-key = "1"

[[sumeragi.trusted-peers]]
address = "2"
public-key = "2"

[[sumeragi.trusted-peers]]
address = "3"
public-key = "3"
```

Or

```toml
[sumeragi]
trusted-peers = [
  { address = "1", public-key = "1" },
  { address = "2", public-key = "2" },
  { address = "3", public-key = "3" },
]
```

### `sumeragi.block-time`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 2 seconds

The period of time a peer waits for the `CreatedBlock` message after
getting a `TransactionReceipt`

### `sumeragi.commit-time-limit`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 4 seconds

The period of time a peer waits for `CommitMessage` from the proxy tail.

### `sumeragi.gossip-period`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 1 second

Period in milliseconds for pending transaction gossiping between peers.

### `sumeragi.gossip-batch-size`

- **Type:** Number
- **Default:** 500

max number of transactions in tx gossip batch message. While configuring
this, pay attention to `p2p` max message size.

### `sumeragi.max-transactions-in-block`

- **Type:** u32
- **Default:** 2_u32.pow(9)

The upper limit of the number of transactions per block.

## Torii Options

Explain Torii module

### `torii.api-address`

- **ENV:** `API_ENDPOINT`
- **Type:** String, [Socket-Address](#type-socket-address)
- **Required**

Address for client API.

```toml
[torii]
api-address = "localhost:8080"
```

### `torii.telemetry-address`

- **Type:** String, [Socket-Address](#type-socket-address)
- **Optional**

address for reporting internal status and metrics for administration.

::: info

This is different from [Telemetry](#telemetry) section. This parameter is
about "passive" telemetry, requested by external actors. That section is
about "active" outbound telemetry, actively produced by Iroha.

:::

### `torii.max-transaction-size`

- **Type:** String or Number, [Byte Size](#type-byte-size)
- **Default:** 2 pow 15 (todo mathjax?) `32_768` (2 \*\* 15)

Maximum number of bytes in raw transaction. Used to prevent from DOS
attacks.

### `torii.max-content-len`

- **Type:** String or Number, [Byte Size](#type-byte-size)
- **Default:** `2 ** 12 * 4000`

Maximum number of bytes in raw message. Used to prevent from DOS attacks.

### `torii.fetch-size`

TODO: use "amount" instead of size. Usually "size" means bytes in this
document

- **Type:** Number
- **Default:** `10`

How many query results are returned in one batch

### `torii.query-idle-time`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** `30_000`

Time query can remain in the store if unaccessed

## Queue Options

Explain Queue module

### `queue.max-transactions-in-queue`

- **Type:** u32
- **Default:** `2 ** 16`

The upper limit of the number of transactions waiting in the queue.

### `queue.max-transactions-in-queue-per-user`

- **Type:** u32
- **Default:** 2 \*\* 16

The upper limit of the number of transactions waiting in the queue for
single user. Use this option to apply throttling.

### `queue.transaction-time-to-live`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 24 hours

The transaction will be dropped after this time if it is still in the
queue.

### `queue.future-threshold`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 1 second

The threshold to determine if a transaction has been tampered to have a
future timestamp.

## Kura Options

Explain Kura module

### `kura.init-mode`

- **Type:** String
- **Possible Values:** `strict` or `fast`
- **Default:** `strict`

`strict` - Strict validation of all blocks. `fast` - Fast initialization
with basic checks.

### `kura.block-store-path`

- **Type:** String
- **Default:** `./storage`

Path to the existing block store folder or path to create new folder.

::: tip Dev Note

Validation of this parameter is kind of delayed. What if error appears very
late after configuration is resolved? It would be useful to throw an error
with a snippet pointing to the configuration

:::

### `kura.blocks-per-storage-file`

- **Type:** non zero u64
- **Default:** 1000

Maximum number of blocks to write into a single storage file.

### `kura.actor-channel-capacity`

- **Type:** Number
- **Default:** 100

See: [Actor Channel Capacity](#actor-channel-capacity)

## Logger Options

Explain module

### `logger.level`

- **ENV:** `LOG`, `LOG_LEVEL`, `IROHA_LOG_LEVEL`
- **Type:** String
- **Possible Values:** `"TRACE"`, `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"`,
  or `"FATAL"`
- **Default:** `"INFO"`

Maximum log level

### `logger.compact-mode`

- **Type:** Boolean
- **Default:** `false`

Compact mode (no spans from telemetry)

### `logger.log-file-path`

- **Type:** String
- **Optional**

TODO: Find a standard name for log file path? (i.e. posix)

If provided, logs will be copied to said file in the format readable by
[bunyan](https://lib.rs/crates/bunyan)

### `logger.terminal-colors`

- **Type:** Boolean
- **Default:** depends on `logger.compact-mode`. If compact mode is
  disabled (which is by default), then `true`. If enabled, then `false`.

Enable ANSI terminal colors for formatted output.

::: warning

This will produce a warning:

```toml
[logger]
compact-mode = true
colorize-output = true # INVALID: should be `false` or omitted
```

:::

## Block Sync Options

Explain module

### `block-sync.actor-channel-capacity`

- **Type:** Number
- **Default:** 100

See: [Actor Channel Capacity](#actor-channel-capacity)

Buffer capacity of actor's MPSC channel

```toml
[block-sync]
actor-channel-capacity = 100
```

### `block-sync.block-batch-size`

- **Type:** Number
- **Default:** 4

The number of blocks that can be sent in one message.

```toml
[block-sync]
block-batch-size = 4
```

### `block-sync.gossip-period`

- **Type:** String or Number, [Duration](#type-duration)
- **Default:** 10 seconds

The period of time to wait between sending requests for the latest block.

```toml
[block-sync]
gossip-period = "5 secs"
```

## World State View Options

Explain module

### `wsv.asset-metadata-limits`

- **Type:** Table, [Metadata Limits](#type-metadata-limits)
- **Default:** [Default Metadata Limits](#default-metadata-limits)

**Example:**

```toml
[wsv.asset-metadata-limits]
max-len = 30
max-entry-byte-size = "2mb"
```

### `wsv.asset-definition-metadata-limits`

TODO

### `wsv.account-metadata-limits`

TODO

### `wsv.domain-metadata-limits`

TODO

### `wsv.ident-length-limits`

Limits for the number of characters in identifiers that can be stored in
the WSV.

FIXME: rename `ident` to something more readable?

### `wsv.transaction-limits`

Limits that all transactions need to obey, in terms of size of WASM blob
and number of instructions.

### `wsv.wasm-runtime.fuel-limit`

The fuel limit determines the maximum number of instructions that can be
executed within a smart contract. Every WASM instruction costs
approximately 1 unit of fuel. See
[`wasmtime` reference](https://docs.rs/wasmtime/0.29.0/wasmtime/struct.Store.html#method.add-fuel)

|          |              |
| -------: | :----------- |
|    Type: | Number       |
| Default: | `23_000_000` |

Example:

```toml
[wsv.wasm-runtime]
fuel-limit = 40_000_000
```

### `wsv.wasm-runtime.max-memory`

Maximum amount of linear memory a given smart contract can allocate.

|          |                                                |
| -------: | :--------------------------------------------- |
|    Type: | String or Number, [Byte Size](#type-byte-size) |
| Default: | `"500 MiB"`                                    |

Example:

```toml
[wsv.wasm-runtime]
max-memory = "1gb"
```

## Telemetry Options

Two Telemetries are supported: Substrate-based and File-based.

### `telemetry.substrate`

Enable Substrate active outbound telemetry.

**Fields:**

- **`name`:** The node's name to be seen on the telemetry
  - **Type:** String
  - **Required**
- **`url`:** The url of the telemetry
  - **Type:** String, URL
  - **Required**
- **`min_retry_period`:** The minimum period of time in seconds to wait
  before reconnecting
  - **Type:** String or Number, [Duration](#type-duration)
  - **Default:** 1 second
- **`max_retry_delay_exponent`:** The maximum exponent of 2 that is used
  for increasing delay between reconnections
  - **Type:** Number, u8
  - **Default:** 4

**Example:**

```toml
[telemetry.substrate]
name = "iroha"
url = "ws://127.0.0.1:8001/submit"
```

### `telemetry.file-output`

Enable file-based active outbound telemetry.

**Fields:**

- **`file`:** The filepath that to write dev-telemetry to
  - **Type:** String, file path
  - **Required**

```toml
[telemetry.file-output]
file = "./././"
```

## Glossary

### Actor Channel Capacity

TODO Explain what does it mean

### Numeric Types

Explain the limitations of different numeric types, like `u8` and `u64`.

### Type - Duration

Might be specified as `"2m"`, `1000` (means ms), `"3h"` etc. TODO.

See
[`humantime` crate](https://docs.rs/humantime/latest/humantime/fn.parse-duration.html)

### Type - Multi-hash

Describe what the hell is this

### Type - Byte Size

Might be a number of bytes, or a readable string

[`humansize` - Rust](https://docs.rs/humansize/latest/humansize/)

### Type - Private Key

```toml
private-key = { digest = "ed25519", payload = "" }
```

### Type - Socket Address

```
<host>:<port>
```

```
localhost:8080
127.0.0.1:1337
sample.com:9090
```

In TOML it should be specified as a string:

```toml
address = "localhost:8000"
```

### Type - Metadata Limits

Bla bla

#### Default Metadata Limits

Display the value here

## Deprecation and Migration Policy

TODO
