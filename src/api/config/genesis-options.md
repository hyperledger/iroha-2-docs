# Genesis Options

Explain the purpose of this block. Maybe explain both keys in a single
section?

## `genesis.public-key`

- **Type:** [Multi-hash](glossary#type-multi-hash)
- **Required**

The public key of the genesis account, should be supplied to all peers.

## `genesis.private-key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Required** if the configured peer submits the genesis block, and
  **optional** otherwise

The private key of the genesis account, only needed for the peer that
submits the genesis block.

::: info

This parameter is required if the peer being configured submits the
genesis, i.e. if it is run with [`--submit-genesis`](../cli#submit-genesis)
(todo link) CLI argument.

:::

::: warning

The warning will be printed if
[`genesis.private-key`](#genesis-private-key) and
[`--submit-genesis`](../cli#submit-genesis) are used without each other.

:::
