# Keys

Now it's a good practice to worry about Public key cryptography, so we'll give you a primer.
Firstly, public and private keys come in pairs. For a given private key it's easy to figure out the corresponding public key, **but the opposite is not true**. The fact that it's practically impossible to figure out what the **private key** corresponding to a given **public key** is why they're called _public_ and _private_: **one is safe to share without compromising on the security of the entire exchange**.
**With a private key, you can encrypt information, in a way, such that only the people who have your public key can read it. You cannot encrypt anything with a public key**.
When we say signed we really mean _attached **a known piece of data encrypted with the private key**._ When something is _signed_, everyone can read it, and **everyone with your public key can verify that the person who wrote that message used your private key**.
As a result, if you're deploying your own network, **you really should change the keys in all three configuration files.** To get new key-pairs, use the `iroha_crypto_cli` program,

```bash
cargo build -p iroha_crypto_cli
./target/debug/iroha_crypto_cli
```

Which will print a fresh pair of keys.
If you want to set up your own network, you should change the keys for all your peers: in `peer/config.json` change `PUBLIC_KEY` and `PRIVATE_KEY`, to the fresh pair. When you've done that, you should add the keys to the `TRUSTED_PEERS` array in the same configuration file.
**EXAMPLE:** in the minimum viable BFT network, you have four peers, so that means that you need to create _four_ different peer configuration files (`config.json`). Each peer should have its own `PUBLIC_KEY` and `PRIVATE_KEY` and all four public keys should be added to the `TRUSTED_PEERS` array (_yes including the peer that you're configuring_), and the same `TRUSTED_PEERS` array must be copied across all four configuration files.
Next, you must make sure that the peers agree on the `GENESIS_ACCOUNT` key pairs.

::: tip

Don't worry about the fact that the genesis account's private key is known to all peers, the genesis account loses all privileges after the first block gets committed.

:::

Finally, while the first client _could_ use the genesis account to register new users, it's not a great idea for private networks. You should, instead, register a non-genesis account (for example *alice@*wonderland) and `unregister` the genesis account.

::: warning NB

`iroha_client_cli` currently doesn't support unregister instructions, if you plan on creating a private blockchain, you should consider writing your own client based off of the `client` Rust crate, or any of the provided client libraries.

:::

Here are the links to the [iroha-python](https://github.com/hyperledger/iroha-python), [iroha-iOS](https://github.com/hyperledger/iroha-ios), [iroha-java](https://github.com/hyperledger/iroha-java) and [iroha-javascript](https://github.com/hyperledger/iroha-javascript) libraries.

Finally, let's talk about how keys are used in the client. Every transaction is signed on behalf of some user, thus every operation requires a key. That doesn't mean that you need to explicitly provide a key every time. For example, you need to have a user to register a user (_just like you need scissors to open a bag with new scissors_). But in order to register a user, you must also provide a new public key, so that the network can verify that it's that trustworthy *mad_hatter@*wonderland, and not some impostor (_possibly sent by the red_queen),_ so there are cases where you need to provide a key explicitly.

Each time `iroha_client_cli` asks you to provide a `--key` argument, it's probably a good idea to generate a new key-pair.
