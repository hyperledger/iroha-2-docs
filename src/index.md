# Iroha 2 Documentation

Iroha is a fully-featured blockchain ledger. With Iroha you can:

- Create and manage custom fungible assets, such as currencies, gold, and
  others
- Create and manage non-fungible assets
- Manage user accounts with a domain hierarchy and multi-signature
  transactions
- Use efficient portable smart contracts implemented either via WebAssembly
  or Iroha Special Instructions
- Use both permissioned and permission-less blockchain deployments

## How Iroha works

To understand how Iroha operates, let's draw parallels between a blockchain
and a computer. If the blockchain is the computer, then in this metaphor of
ours the client binary (for example: `iroha_client_cli`) is the keyboard,
the blockchain is the hard drive, and the Iroha peer software is the
processor. Like a processor, Iroha accepts portable instructions that
modify what's written to the blockchain, allow certain users to use the
network, and lock others out.

Any operation that is run on-chain is written in terms of
[Iroha Special Instructions (ISI)](./guide/blockchain/instructions.md), and
there is no other way of modifying the world state.

Each interaction with the blockchain is done via a _transaction_. A
transaction is a collection of _instructions_, which are either glued
together in sequence or compiled into what we affectionately call a
[WASM](./guide/blockchain/wasm.md) blob. You need these instructions to
register an account, remove an account, add X amount of Y currency, and so
on.

To read the information encoded in the blocks of a blockchain (the current
world state), you use [queries](./guide/blockchain/queries.md). Queries are
submitted like instructions, but they're not tracked and recorded in
blocks, so they're much more lightweight. If you use queries as part of
complicated logic (e.g. inside WASM), they have a non-negligible impact on
the size of the blocks. Queries that are only used to get information leave
no trace in the blockchain.

## Navigation

If you have previously worked with Iroha, start with our comparison of
[Iroha 1 and Iroha 2](./guide/iroha-2.md). That will help you understand
the differences between the two versions and upgrade to the newer one.

Check the [tutorial](guide/intro.md) part of this documentation where you
can follow one of the available language-specific guides in Bash, Rust,
Kotlin, Javascript, or Python. The guides introduce you to the basic
concepts and provide code snippets that you can run yourself.

In the Blockchain chapter you can find documentation for Iroha features,
such as [Iroha Special Instructions](/guide/blockchain/instructions.md),
[triggers](/guide/blockchain/triggers.md),
[queries](/guide/blockchain/queries.md).

The Configuration and Management section explains Iroha 2 configuration
files in greater detail and covers topics such as
[public key cryptography](/guide/configure/keys.md),
[peer management](/guide/configure/peer-management.md), and
[public and private modes](/guide/configure/modes.md).

## Learn More

For more information on Iroha 2, please take a look at the
[Iroha 2 Whitepaper](https://github.com/hyperledger/iroha/blob/iroha2/docs/source/iroha_2_whitepaper.md),
as well as the Hyperledger Iroha section within the
[Hyperledger Foundation Wiki](https://wiki.hyperledger.org/display/iroha).

For more information on Iroha 1, take a look at the
[Iroha 1 documentation](https://iroha.readthedocs.io/en/develop/index.html).

::: tip

If you want to contribute to Hyperledger Iroha, please look at our
[Contributing Guide](https://github.com/hyperledger/iroha/blob/iroha2-dev/CONTRIBUTING.md).

:::
