# Iroha Special Instructions

The basic premise is; if the blockchain is the computer, then the client
library (`iroha_client_cli` or any other) is the keyboard, the blockchain
is the hard drive, and the Iroha peer software is the processor. Like a
processor, Iroha accepts portable instructions that modify what's written
to the blockchain, allow certain users to use the network, and lock others
out.

Any operation that is run on-chain is written in terms of _Iroha Special
Instructions (ISI)_, and there is no other way of modifying the world state
that would pass consensus. To understand why, we'll need to make a short
detour into how Iroha is implemented under the hood.

## How Iroha works

Each interaction with the blockchain is done via a _transaction_.
Transaction is a collection of _instructions_, which are either glued
together in sequence or called from a WASM blob (more on that later). You
need these instructions to register an account, remove an account, add X
amount of Y currency, and so on.

You may also interact with the blockchain via _queries_, which you use to
get some kind of information from the blockchain (only the information you
are allowed to access). Queries are also instructions.

### Consensus

Each time you send a transaction to Iroha, it gets put into a queue, and
when the time comes, the queue is emptied, and the consensus process
begins. This process is a bit of mundane with a bit of black magic[^1].

The mundane aspect is that a special set of peers needs to take the
transaction queue, and reproduce the same world state. If the world state
cannot be reproduced for some reason or another, none of the transactions
get committed to a block and consensus tries again.

The reasoning behind this algorithm is simple: if someone had some evil
peers and connected them to the existing network, if they tried to fake
data, some good™ peers would not get the same (evil™) world state. If
that's the case, the evil™ peers would not be allowed to participate in
consensus, and you would eventually produce a block using only good™ peers.

If any changes to the world state are made without Iroha Special
Instructions, they would not pass consensus and never get committed to a
block.

## Instructions

So what kinds of special instructions do we have? If you've read the
tutorial on [Rust](../rust.md) or [Python](../python.md), you've already
seen a couple of instructions: `Register<Account>` and `Mint<Quantity>`.

For the exhaustive list of Instructions you should consult
[our source code](https://github.com/hyperledger/iroha/tree/iroha2-dev/core/src/smartcontracts/isi).
Here we will cover only some important classes.

### (Un)Register

Registering and unregistering are the instructions used to give an ID to a
new entity on the blockchain.

Everything that can be registered is `Identifiable`, but not everything
that's `Identifiable` can be registered. As a rule, everything that can be
registered, can also be un-registered, but that is not a hard and fast
rule.

You can register a new account, a new asset definition, a peer, and a
trigger (more on them later). Registering a peer is currently the only way
of adding peers that were not part of the original `TRUSTED_PEERS` array to
the network.

Registering an account is different. Iroha can be compiled in two modes:
_public_ and _private_. If it's compiled with _private_ permissions, to
register an account, you need an account. This is the default. If you want
your users to be able to register without access to a pre-existing account,
you need to compile Iroha in the _public_ mode.

::: info

As of writing, the set of public blockchain permissions is incomplete, and
as such Iroha source code needs to be modified to run it in the _public_
mode.

:::

### Mint/Burn

Minting and burning can refer to assets, triggers (if the trigger has a
limited number of repetitions), and temporary permission tokens. Some
assets can be declared as non-mintable, meaning that they can be minted
only once after registration.

Assets and permission tokens need to be minted to a specific account,
usually the one that registered the asset in the first place. All assets
are assumed to be non-negative as well, so you can never have `-1.0` of
`time` or `Burn` a negative amount and get a `Mint`.

### Grant/Revoke

These are used specifically for permissions. When minting a permission
token, a user is granted `X` amount of permissions to do `Y`, and the token
will expire once all `X` operations were performed.

By contrast, the `Grant` operation can be used to permanently grant a user
either a single permission, or a group of permissions (a "role"). As such
these instructions should be used carefully.

### `SetKeyValue`/`RemoveKeyValue`

These instructions are used with the key/value `Store` asset type. This use
case has not received much attention so far, because storing data in the
blockchain is a rather advanced topic that we shall cover separately.

### Query

We talk extensively about queries [later](queries.md) when we list all the
queries that can be made from the client side. This is not necessarily the
only kind of information that is available on the network, but it's the
only kind of information that is guaranteed to be accessible on all
networks.

Telemetry data is optional to the specific deployment of Iroha. Access to
your account balance is required function.

### Expressions, Conditionals, Logic

All ISI operate on expressions. Each expression has an `EvaluatesTo`, which
is used in instruction execution. While you could specify the account name
directly, you could also specify the account ID via some mathematical or
string operation. You can check if an account is registered on the
blockchain too.

Using expressions that implement `EvaluatesTo<bool>`, you can set up
conditional logic and execute more sophisticated operations on-chain. For
example, you can submit a `Mint` instruction only if a specific account is
registered.

Recall that you can combine this with queries, and as such can program the
blockchain to do some amazing stuff. This is what we refer to as _smart
contracts_, the defining feature of the advanced usage of blockchain
technology.

[^1]:
    For prospective wizards, the
    [Iroha 2 Whitepaper](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/iroha_2_whitepaper.md)
    is a good start.
