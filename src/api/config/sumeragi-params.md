# Sumeragi Parameters

TODO Explain sumeragi module

## `sumeragi.trusted_peers`

<!--

Hey, is sumeragi.trusted_peers actually required to be set in the config?

I guess that's the only way to specify the relevant topology and let the nodes know what addresses to communicate with as well as what public keys to use to verify respective node signatures

> Other peers might specify it as a trusted one

it should be bi-directional to support the consensus I guess

> or clients might commit transactions which will register a new peer

right.. actually Iroha v1 relies on that more, such a transaction was defined in the genesis (instead of the config), though it might be tricky if all of these peers are not relevant (unregistered in the post-genesis state) anymore and that's why  there was an alternative needed (e.g. config) to contain a set of at least one peer (to sync from), once the WSV is relevant, the topology can be recovered from the blockstore/wsv

I guess it is, at least for a private chain, excluding a scenario of the only node in a network. Otherwise how would a node understand whom to trust (where to get the public key from)

-->

- **Type:** Array of Peer Ids
- **Optional**

Optional list of predefined trusted peers.

Each Peer Id consists of:

- **`address`:** Address of the peer.
  - **Type:** String, [Socket-Address](glossary#type-socket-address)
  - **Required**
- **`public_key`:** Public key of the peer.
  - **Type:** String, [Multi-hash](glossary#type-multi-hash)
  - **Required**



```toml
peer_id = { address = "localhost:1338", public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9" }
```

An array can be defined in two ways. Like this:

```toml
[[sumeragi.trusted_peers]]
address = "localhost:1338"
public_key = "ed012067C02E340AADD553BCF7DB28DD1F3BE8BE3D7581A2BAD81580AEE5CC75FEBD45"

[[sumeragi.trusted_peers]]
address = "localhost:1339"
public_key = "ed0120236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B"

[[sumeragi.trusted_peers]]
address = "localhost:1340"
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```

Or like this:

```toml
[sumeragi]
trusted_peers = [
  { address = "localhost:1338", public_key = "ed012067C02E340AADD553BCF7DB28DD1F3BE8BE3D7581A2BAD81580AEE5CC75FEBD45" },
  { address = "localhost:1339", public_key = "ed0120236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B" },
  { address = "localhost:1340", public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9" },
]
```

## `sumeragi.block_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 2 seconds

The period of time a peer waits for the `CreatedBlock` message after
getting a `TransactionReceipt`.

## `sumeragi.commit_time_limit`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 4 seconds

The period of time a peer waits for `CommitMessage` from the proxy tail.

## `sumeragi.gossip_period`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

Period in milliseconds for pending transaction gossiping between peers.

## `sumeragi.transactions_per_gossip`

- **Type:** Number
- **Default:** 500

Max number of transactions in a gossip batch message. While configuring
this, pay attention to `p2p` max message size.

## `sumeragi.max_transactions_in_block`

- **Type:** u32
- **Default:** $2^9 = 512$

The upper limit of the number of transactions per block.
