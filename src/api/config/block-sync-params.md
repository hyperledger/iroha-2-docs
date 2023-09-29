# Block Sync Parameters

This module is responsible for block synchronization between peers.

## `block_sync.blocks_per_message`

- **Type:** Number
- **Default:** $4$

The amount of blocks that can be sent in a single synchronization message.

**Example:**

```toml
[block_sync]
block_batch_amount = 4
```

## `block_sync.gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 10 seconds

The time interval between requests to peers for the most recent block.

**Example:**

```toml
[block_sync]
gossip_period = "5 secs"
```
