## Block Sync Options

Explain module

### `block-sync.block-batch-size`

- **Type:** Number
- **Default:** $4$

The number of blocks that can be sent in one message.

```toml
[block-sync]
block-batch-size = 4
```

### `block-sync.gossip-period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 10 seconds

The period of time to wait between sending requests for the latest block.

```toml
[block-sync]
gossip-period = "5 secs"
```
