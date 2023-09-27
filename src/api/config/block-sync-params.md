# Block Sync Parameters

TODO Explain module

## `block_sync.block_batch_amount`

- **Type:** Number
- **Default:** $4$

The number of blocks that can be sent in one message.

```toml
[block_sync]
block_batch_amount = 4
```

## `block_sync.gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 10 seconds

The period of time to wait between sending requests for the latest block.

```toml
[block_sync]
gossip_period = "5 secs"
```
