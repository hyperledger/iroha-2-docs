# Iroha Special Instructions

To understand how Iroha operates, let's draw parallels between a blockchain
and a computer. If the blockchain is the computer, then in this metaphor of
ours the client binary (for example: `iroha_client_cli`) is the keyboard,
the blockchain is the hard drive, and the Iroha peer software is the
processor. Like a processor, Iroha accepts portable instructions that
modify what's written to the blockchain, allow certain users to use the
network, and lock others out.

Any operation that is run on-chain is written in terms of _Iroha Special
Instructions (ISI)_, and there is no other way of modifying the world
state. To understand why, we'll need to make a short detour into how Iroha
is implemented under the hood.

## How Iroha works

Each interaction with the blockchain is done via a _transaction_. A
transaction is a collection of _instructions_, which are either glued
together in sequence or compiled into what we affectionately call a WASM
blob (more on that later). You need these instructions to register an
account, remove an account, add X amount of Y currency, and so on.

To read the information encoded in the blocks of a blockchain (the current
world state), you use _queries_. Queries are submitted like instructions,
but they're not tracked and recorded in blocks, so they're much more
lightweight. If you use queries as part of complicated logic (e.g. inside
WASM), they have a non-negligible impact on the size of the blocks. Queries
that are only used to get information leave no trace in the blockchain.

### Consensus

Each time you send a transaction to Iroha, it gets put into a queue. When
it's time to produce a new block, the queue is emptied, and the consensus
process begins. This process is equal parts common sense and black
magic[^1].

The mundane aspect is that a special set of peers needs to take the
transaction queue and reproduce the same world state. If the world state
cannot be reproduced for some reason or another, none of the transactions
get committed to a block.

The consensus starts over from scratch by choosing a different special set
of peers. This is where the black magic comes in. There is a number of
things that are fine-tuned: the number of peers in the voting process, the
way in which subsequent voting peers are chosen, and the way in which the
peers communicate that consensus has failed. Because this changes the view
of the world, the process is called a _view change_. The exact reason for
why the view was changed is encoded in the _view change proof_, but
decoding that information is an advanced topic that we won't cover here.

The reasoning behind this algorithm is simple: if someone had some evil
peers and connected them to the existing network, if they tried to fake
data, some good™ peers would not get the same (evil™) world state. If
that's the case, the evil™ peers would not be allowed to participate in
consensus, and you would eventually produce a block using only good™ peers.

As a natural consequence, if any changes to the world state are made
without the use of ISI, the good™ peers cannot know of them. They won't be
able to reproduce the hash of the world state, and thus consensus will
fail. Same thing happens if the peers have different instructions.

## Instructions

So what kinds of special instructions do we have? If you've read the
tutorial for [Rust](../rust.md) or [Python](../python.md), you've already
seen a couple of instructions: `Register<Account>` and `Mint<Quantity>`.

For the exhaustive list of Instructions you should consult
[our source code](https://github.com/hyperledger/iroha/tree/iroha2-dev/core/src/smartcontracts/isi).

Here we will cover only some important classes.

### (Un)Register

Registering and unregistering are the instructions used to give an ID to a
new entity on the blockchain.

Everything that can be registered is both `Registrable` and `Identifiable`,
but not everything that's `Identifiable` is `Registrable`. Most things are
registered directly, like `Peer`s, but in some cases the representation in
the blockchain has considerably more data. For security and performance
reasons, we use builders for such data structures (e.g. `NewAccount`). As a
rule, everything that can be registered, can also be un-registered, but
that is not a hard and fast rule.

You can register domains, accounts, asset definitions, peers, roles, and
triggers (more on them later).

Registering a peer is currently the only way of adding peers that were not
part of the original `TRUSTED_PEERS` array to the network.

<!-- Check: a reference about future releases or work in progress -->

Registering an account is different. Iroha can be compiled in two modes:
_public_ and _private_. If it's compiled with _private_ permissions, to
register an account, you need an account. This is the default. If you want
your users to be able to register without access to a pre-existing account,
you need to compile Iroha in the _public_ mode.

::: info

<!-- Check: a reference about future releases or work in progress -->

As of writing, the set of public blockchain permissions is incomplete, and
as such Iroha source code needs to be modified to run it in the _public_
mode.

:::

Refer to one of the language-specific guide to walk you through the process
of registering objects in a blockchain:

| Language              | Guide                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bash                  | Register a [domain](../bash.md#3-registering-a-domain), an [account](../bash.md#4-registering-an-account), an [asset](../bash.md#5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](../rust.md#3-registering-a-domain), an [account](../rust.md#4-registering-an-account), an [asset](../rust.md#5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](../kotlin-java.md#3-registering-a-domain), an [account](../kotlin-java.md#4-registering-an-account), an [asset](../kotlin-java.md#5-registering-and-minting-assets) |
| Python                | Register a [domain](../python.md#3-registering-a-domain), an [account](../python.md#4-registering-an-account), an [asset](../python.md#5-registering-and-minting-assets)                |
| JavaScript/TypeScript | Register a [domain](../javascript.md#3-registering-a-domain), an [account](../javascript.md#4-registering-an-account), an [asset](../javascript.md#5-registering-and-minting-assets)    |

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

These are used for [permissions and roles](permissions.md).

`Grant` is used to permanently grant a user either a single permission, or
a group of permissions (a "role"). Granted roles and permissions can only
be removed via the `Revoke` instruction. As such, these instructions should
be used carefully.

### `SetKeyValue`/`RemoveKeyValue`

These instructions are used with the key/value
[`Store` asset type](../objects/metadata.md#store-asset). This use case has
not received much attention so far, because storing data in the blockchain
is a rather advanced topic that we shall cover separately.

### Query

We talk extensively about queries in the [dedicated section](queries.md)
where all the queries that can be made from the client-side are listed.
This is not necessarily the only kind of information that is available on
the network, but it's the only kind of information that is _guaranteed_ to
be accessible on all networks.

For each deployment of Iroha, there might be other available information.
For example, the availability of telemetry data is up to the network
administrators. It's entirely their decision whether or not they want to
allocate processing power to track the work instead of using it to do the
actual work. By contrast, some functions are always required, e.g. having
access to your account balance.

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
