# Network Parameters

## `network.address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address for p2p communication for consensus (sumeragi) and block synchronization (block_sync) purposes.

```toml
[network]
address = "localhost:1337"
```

TODO: wait for renamings

## `network.block_gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 10 seconds

The time interval between requests to peers for the most recent block.

**Example:**

```toml
[sumeragi]
block_gossip_period = "5s"
```

::: warning

More frequent gossiping shortens the time to sync, but can overload the
network.

:::

## `network.max_blocks_per_gossip`

- **Type:** Number
- **Default:** $4$

The amount of blocks that can be sent in a single synchronization message.

**Example:**

```toml
[sumeragi]
max_blocks_per_gossip = 4
```

## `network.max_transactions_per_gossip`

- **Type:** Number
- **Default:** $500$

Max number of transactions in a gossip batch message. Smaller size leads to
longer time to synchronise, but useful if you have high packet loss.

**Example:**

```toml
[sumeragi]
max_transactions_per_gossip = 500
```

## `network.transaction_gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

Period for pending transaction gossiping between peers.

**Example:**

```toml
[sumeragi]
transaction_gossip_period = "1s"
```

::: warning

More frequent gossiping shortens the time to sync, but can overload the
network.

:::