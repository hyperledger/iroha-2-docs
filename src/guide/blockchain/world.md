# World

`World` is the global entity that contains other entities. The `World`
consist of:

- the list of
  [trusted peers](/guide/configure/peer-configuration#trusted-peers)
- registered domains
- registered [triggers](/guide/blockchain/triggers.md)
- registered
  [roles](/guide/blockchain/permissions.md#permission-groups-roles)
- registered
  [permission token definitions](/guide/blockchain/permissions.md#permission-tokens)
- permission tokens for all accounts
- [the chain of runtime validators](/guide/blockchain/permissions.md#runtime-validators)

When domains, peers, or roles are registered or unregistered, the `World`
is the target of the (un)register
[instruction](/guide/blockchain/instructions.md).

## World State View (WSV)

World State View is the in-memory representation of the current blockchain
state. This includes all currently loaded blocks, with all of their
contents, as well as peers elected for the current epoch.
