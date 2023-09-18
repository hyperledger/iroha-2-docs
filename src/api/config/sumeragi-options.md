# Sumeragi Options

Explain sumeragi module

## `sumeragi.trusted-peers`

- **Type:** Array of Peer Ids

Optional _(?)_ list of predefined trusted peers.

Peer Id:

- **`address`:** Address of the peer. See:
  [`network.address`](network-options#network-address).
  - **Type:** String, [Socket-Address](glossary#type-socket-address)
  - **Required**
- **`public-key`:** Public key of the peer.
  - **Type:** String, [Multi-hash](glossary#type-multi-hash)
  - **Required**

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

## `sumeragi.block-time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 2 seconds

The period of time a peer waits for the `CreatedBlock` message after
getting a `TransactionReceipt`

## `sumeragi.commit-time-limit`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 4 seconds

The period of time a peer waits for `CommitMessage` from the proxy tail.

## `sumeragi.gossip-period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

Period in milliseconds for pending transaction gossiping between peers.

## `sumeragi.gossip-batch-size`

- **Type:** Number
- **Default:** 500

max number of transactions in tx gossip batch message. While configuring
this, pay attention to `p2p` max message size.

## `sumeragi.max-transactions-in-block`

- **Type:** u32
- **Default:** $2^9 = 512$

The upper limit of the number of transactions per block.
