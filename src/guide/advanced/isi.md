# Iroha Special Instructions

When we talked about [how Iorha operates](intro.md#how-iroha-works), we
said that Iroha Special Instructions is the only way to modify the world
state. So what kinds of special instructions do we have? If you've read the
tutorial for [Rust](../rust.md) or [Python](../python.md), you've already
seen a couple of instructions: `Register<Account>` and `Mint<Quantity>`.

In the chapter on blockchain objects, we provide you with
[a summary](../objects/instructions.md) of Iroha Special Instructions:
which objects each instruction can be called for, and what are the
instructions available for each object.

Here we present you with the overview of each instruction.

| Instruction                                              | Descriptions                                      |
| -------------------------------------------------------- | ------------------------------------------------- |
| [Register/Unregister](#unregister)                       | Give an ID to a new entity on the blockchain.     |
| [Mint/Burn](#mintburn)                                   | Mint/burn assets, triggers, or permission tokens. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalueremovekeyvalue) | Update metadata of blockchain objects.            |
| [Grant/Revoke](#grantrevoke)                             | Give accounts certain permissions or remove them. |
| [Transfer](#transfer)                                    | Transfer assets between accounts.                 |
| [ExecuteTrigger](#executetrigger)                        | Execute triggers.                                 |
| [If, Pair, Sequence](#composite-instructions)            | Use to create composite instructions.             |

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

## Transfer

Similarly to mint and burn instructions, transferring refers to assets. You
can transfer assets between different accounts.

<!--TODO: add links to transferring assets example in which guide after https://github.com/hyperledger/iroha-2-docs/issues/81 is addressed -->

## Grant/Revoke

These are used for [permissions and roles](permissions.md).

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
- `Sequence`: execute provided vector of instructions in a given order
- `Pair`: execute both provided instructions in a specified order
