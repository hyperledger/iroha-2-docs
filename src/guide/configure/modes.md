# Public and Private Blockchains

Iroha can be compiled in two modes: **public** and **private**. The mode
determines the set permissions granted to users as well as how peers can
join the network.

Below we outline the major differences in these two use cases.

## Permissions

In a _public_ blockchain, most accounts have the same set of permissions.
In a _private_ blockchain, most accounts are assumed not to be able to do
anything outside of their own account or domain unless explicitly granted
said permission.

::: info

Refer to the [dedicated section on permissions](../advanced/permissions.md)
for more details.

:::

## Peers

Any peer can join a _public_ blockchain. For a _private_ blockchain,
automatic discovery of peers is turned off.

::: info

Refer to [peer management](register-unregister.md) for more details.

:::

## Registering accounts

In a _private_ blockchain, you need an account to register another account.
In a _public_ blockchain, registering accounts can be done without having a
pre-existing account.

::: info

Refer to the section on [instructions](../advanced/isi.md#un-register) for
more details.

:::
