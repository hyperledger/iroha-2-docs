# On-Chain Configuration

## `block_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 2 seconds

Time since the round start[^1] by which a new block should be created regardless if there were enough transactions or
not. Used to force block commits when there is a small influx of new transactions.

A block might be created earlier if there is enough transactions in the [Queue](queue-params). The limit of transactions
is configured by [`transactions_in_block`](#transactions-in-block).

**Example:**

```toml
block_time = "2s"
```

## `commit_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 4 seconds

Time by which a newly created block should be committed. Prevents malicious nodes from stalling the network by not
participating in consensus.

The block creation is configured with [`block_time`](#block-time) and [`transactions_in_block`](#transactions-in-block).

**Example:**

```toml
commit_time = "4s"
```

## `transactions_in_block`

- **Type:** u32
- **Default:** $2^9 = 512$

The upper limit of the number of transactions per block. If there is enough transactions in the [Queue](queue-params),
the block is created immediately. Otherwise, the block is created when [`block_time`](#block-time) is elapsed since the
round start[^1].

**Example:**

```toml
transactions_in_block = 512
```

## `wsv.transaction_limits`

## `wsv.identifier_length_limits`

## `wsv.domain_metadata_limits`

## `wsv.account_metadata_limits`

## `wsv.asset_definition_metadata_limits`

## `wsv.asset_metadata_limits`

## `wsv.wasm_fuel_limit`

## `wsv.wasm_memory_limit`
