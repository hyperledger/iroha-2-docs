# Network Parameters

TODO Explain network module

## `network.address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address for p2p communication for consensus and block synchronization purposes.

TODO consider making it just the root-level `address` parameter? (like `public_key` and `private_key`) Or move back to
`sumeragi.p2p_address`? `network` module seems empty
