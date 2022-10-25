# Iroha Special Instructions

When we spoke about [how Iroha operates](intro.md#how-iroha-works), we said
that Iroha Special Instructions are the only way to modify the world state.
So, what kind of special instructions do we have? If you've read the
language-specific guides in this tutorial, you've already seen a couple of
instructions: `Register<Account>` and `Mint<Quantity>`.

In the chapter on blockchain objects, we provide you with
[a summary](../objects/instructions.md) of Iroha Special Instructions: what
objects each instruction can be called for, and what are the instructions
available for each object.

Here we present you with an overview of each instruction.

| Instruction                                               | Descriptions                                      |
| --------------------------------------------------------- | ------------------------------------------------- |
| [Register/Unregister](#un-register)                       | Give an ID to a new entity on the blockchain.     |
| [Mint/Burn](#mint-burn)                                   | Mint/burn assets, triggers, or permission tokens. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | Update metadata of blockchain objects.            |
| [Grant/Revoke](#grant-revoke)                             | Give or remove certain permissions from accounts. |
| [Transfer](#transfer)                                     | Transfer assets between accounts.                 |
| [ExecuteTrigger](#executetrigger)                         | Execute triggers.                                 |
| [If, Pair, Sequence](#composite-instructions)             | Use to create composite instructions.             |

## (Un)Register

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
triggers.

::: info

Note that depending on how you decide to set up your
[genesis block](../configure/genesis.md) in `genesis.json` (specifically,
whether or not you include registration of permission tokens), the process
for registering an account can be very different. In general, we can
summarise it like this:

- In a _public_ blockchain, anyone should be able to register an account.
- In a _private_ blockchain, there can be a unique process for registering
  accounts. In a _typical_ private blockchain, i.e. a blockchain without
  any unique processes for registering accounts, you need an account to
  register another account.

We discuss these differences in great detail when we
[compare private and public blockchains](../configure/modes.md).

:::

::: info

Registering a peer is currently the only way of adding peers that were not
part of the original `TRUSTED_PEERS` array to the network.

<!-- Check: a reference about future releases or work in progress -->

:::

Refer to one of the language-specific guides to walk you through the
process of registering objects in a blockchain:

| Language              | Guide                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bash                  | Register a [domain](../bash.md#_3-registering-a-domain), an [account](../bash.md#_4-registering-an-account), an [asset](../bash.md#_5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](../rust.md#_3-registering-a-domain), an [account](../rust.md#_4-registering-an-account), an [asset](../rust.md#_5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](../kotlin-java.md#_3-registering-a-domain), an [account](../kotlin-java.md#_4-registering-an-account), an [asset](../kotlin-java.md#_5-registering-and-minting-assets) |
| Python                | Register a [domain](../python.md#_3-registering-a-domain), an [account](../python.md#_4-registering-an-account), an [asset](../python.md#_5-registering-and-minting-assets)                |
| JavaScript/TypeScript | Register a [domain](../javascript.md#_3-registering-a-domain), an [account](../javascript.md#_4-registering-an-account), an [asset](../javascript.md#_5-registering-and-minting-assets)    |

## Mint/Burn

Minting and burning can refer to assets, triggers (if the trigger has a
limited number of repetitions), and temporary permission tokens. Some
assets can be declared as non-mintable, meaning that they can be minted
only once after registration.

Assets and permission tokens need to be minted to a specific account,
usually the one that registered the asset in the first place. All assets
are assumed to be non-negative as well, so you can never have `-1.0` of
`time` or `Burn` a negative amount and get a `Mint`.

Refer to one of the language-specific guides to walk you through the
process of minting assets in a blockchain:

- [Bash](../bash.md#_5-registering-and-minting-assets)
- [Rust](../rust.md#_5-registering-and-minting-assets)
- [Kotlin/Java](../kotlin-java.md#_5-registering-and-minting-assets)
- [Python](../python.md#_5-registering-and-minting-assets)
- [JavaScript/TypeScript ](../javascript.md#_5-registering-and-minting-assets)

Here are examples of burning assets:

- [Bash](../bash.md#_7-burning-assets)
- [Rust](../rust.md#_6-burning-assets)

## Transfer

Similar to mint and burn instructions, transferring refers to assets. You
can transfer assets between different accounts.

To do this, an account have to be granted the
[permission to transfer assets](./permissions.md#cantransferuserassets).
Refer to an example on how to
[transfer assets in Bash](../bash.md#_6-transferring-assets).

<!--TODO: add links to transferring assets example in which guide after https://github.com/hyperledger/iroha-2-docs/issues/81 is addressed -->

## Grant/Revoke

Grant and revoke instructions are used for account
[permissions and roles](permissions.md).

`Grant` is used to permanently grant a user either a single permission, or
a group of permissions (a "role"). Granted roles and permissions can only
be removed via the `Revoke` instruction. As such, these instructions should
be used carefully.

## `SetKeyValue`/`RemoveKeyValue`

These instructions are used with the key/value
[`Store` asset type](../objects/metadata.md#store-asset). This use case has
not received much attention so far, because storing data in the blockchain
is a rather advanced topic that we shall cover separately.

## `ExecuteTrigger`

This instruction is used to execute [triggers](./triggers.md).

## Composite instructions

Iroha also offers composite instructions (`If`, `Pair`, `Sequence`) to
execute instructions in a certain way:

- `If`: execute one of the two given instructions based on a given
  condition
- `Sequence`: execute a provided vector of instructions in a given order
- `Pair`: execute both provided instructions in a specified order
