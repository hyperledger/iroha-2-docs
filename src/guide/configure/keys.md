# Public Key Cryptography

It is a good practice to worry about public key cryptography, so we'll give
you a primer.

Firstly, public and private keys come in pairs. For a given private key
it's easy to figure out the corresponding public key, but the opposite is
not true. The fact that it's practically impossible to figure out the
private key for a given public key is why they're called _public_ and
_private_: **the public one is safe to share without compromising the
security of the entire exchange**.

With a private key, you can encrypt information in such a way that only the
people who have your public key can read it. You cannot encrypt anything
with a public key.

When you encrypt data with a private key, you _sign_ it. When something is
_signed_, everyone can read it, and everyone with your public key can
verify that the person who wrote that message used your private key.

## Keys for Deploying a Network

Keeping in mind what we said above about key cryptography, note that if
you're deploying your own network, you should change the keys in all three
configuration files
([`/configs/peer/config.json`](./peer-configuration.md),
[`configs/client_cli/config.json `](./client-configuration.md), and
[`configs/peer/genesis.json`](./genesis.md)).

### 1. Generate new key-pairs

To get new key-pairs, use the `iroha_crypto_cli` program:

```bash
cargo build -p iroha_crypto_cli
./target/debug/iroha_crypto_cli
```

This will print a fresh pair of keys.

### 2. Update keys for each peer

If you want to set up your own network, you should change the keys for all
your peers: in `peer/config.json` change `PUBLIC_KEY` and `PRIVATE_KEY` to
the fresh pair. When you've done that, you should add the keys to the
`TRUSTED_PEERS` array in the same configuration file.

Let's consider an example of a minimum viable BFT network. In this network
you have four peers, so that means that you need to create _four_ different
peer configuration files (`config.json`).

Each peer should have its own `PUBLIC_KEY` and `PRIVATE_KEY`. You should
add all four public keys to the `TRUSTED_PEERS` array, including the peer
that you're configuring. The same `TRUSTED_PEERS` array must be copied
across all four configuration files.

Next, you must make sure that the peers agree on the `GENESIS_ACCOUNT` key
pairs.

::: tip

Don't worry about the fact that the private key for the genesis account is
known to all peers. The genesis account loses all privileges after the
first block gets committed.

:::

### 3. Register a non-genesis account

Finally, while the first client _could_ use the genesis account to register
new users, it's not a great idea for private networks. You should, instead,
register a non-genesis account (for example _alice_@wonderland) and
`unregister` the genesis account.

::: warning NB

`iroha_client_cli` currently doesn't support unregister instructions. If
you plan on creating a private blockchain, you should consider writing your
own client based on the `client` Rust crate, or any of the provided client
libraries: [iroha-python](https://github.com/hyperledger/iroha-python),
[iroha-iOS](https://github.com/hyperledger/iroha-ios),
[iroha-java](https://github.com/hyperledger/iroha-java), or
[iroha-javascript](https://github.com/hyperledger/iroha-javascript/tree/iroha2).

:::

## Keys on the Client Side

Finally, let's talk about how keys are used in the client.

Every transaction is signed on behalf of some user, thus every operation
requires a key. That doesn't mean that you need to explicitly provide a key
every time.

For example, you need to have a user to register a user (just like you need
scissors to cut off the tag from a pair of new scissors). But in order to
register a user, you must also provide a new public key, so that the
network can verify that it's that trustworthy _mad_hatter_@wonderland, and
not some impostor (possibly sent by the _red_queen_), so there are cases
where you need to provide a key explicitly.

Each time `iroha_client_cli` asks you to provide a `--key` argument, it's
probably a good idea to generate a new key-pair.
