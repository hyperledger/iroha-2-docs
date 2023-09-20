# Sumeragi Options

Explain sumeragi module

## `sumeragi.trusted_peers`

- **Type:** Array of Peer Ids

Optional _(?)_ list of predefined trusted peers.

Peer Id:

- **`address`:** Address of the peer. See:
  [`network.address`](network-options#network-address).
  - **Type:** String, [Socket-Address](glossary#type-socket-address)
  - **Required**
- **`public_key`:** Public key of the peer.
  - **Type:** String, [Multi-hash](glossary#type-multi-hash)
  - **Required**

```toml
peer_id = { address = "", public_key = "" }
```

Define an array in two ways

```toml
[[sumeragi.trusted_peers]]
address = "1"
public_key = "1"

[[sumeragi.trusted_peers]]
address = "2"
public_key = "2"

[[sumeragi.trusted_peers]]
address = "3"
public_key = "3"
```

Or

```toml
[sumeragi]
trusted_peers = [
  { address = "1", public_key = "1" },
  { address = "2", public_key = "2" },
  { address = "3", public_key = "3" },
]
```

## `sumeragi.block_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 2 seconds

The period of time a peer waits for the `CreatedBlock` message after
getting a `TransactionReceipt`

## `sumeragi.commit_time_limit`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 4 seconds

The period of time a peer waits for `CommitMessage` from the proxy tail.

## `sumeragi.gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

Period in milliseconds for pending transaction gossiping between peers.

## `sumeragi.gossip_batch_size`

- **Type:** Number
- **Default:** 500

max number of transactions in tx gossip batch message. While configuring
this, pay attention to `p2p` max message size.

## `sumeragi.max_transactions_in_block`

- **Type:** u32
- **Default:** $2^9 = 512$

The upper limit of the number of transactions per block.
