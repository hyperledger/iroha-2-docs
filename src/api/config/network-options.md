# Network Options

Explain network module

## `network.address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

address for p2p communication for consensus and block synchronization
purposes.

::: tip

This address is what other peers should specify in their
[`sumeragi.trusted-peers`](#sumeragi-trusted-peers)

:::

## `network.actor-channel-capacity`

- **Type:** Number
- **Default:** $100$

See: [Actor Channel Capacity](glossary#actor-channel-capacity)
