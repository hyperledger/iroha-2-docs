# Public Key Cryptography

It's OK to feel worried about public key cryptography. This is a complex
topic that requires a lot of care and attention. To work with Iroha you
_do_ need to have a basic understanding of how it works, so we provided you
with a brief primer.

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

## Key Generation with Kagami

You can use one of Iroha tools, `kagami`, to generate key pairs. To create
a new key pair, run:

```bash
cargo run --bin kagami  -- crypto
```

Use the `-a` flag to specify the algorithm for key-pair generation and the
`-s` flag to specify the seed. For example, to generate a `secp256k1` key
pair, run:

```bash
cargo run --bin kagami -- crypto --algorithm secp256k1
```

The output will look like this:

```
Public key (multihash): e701210250a46ea6e1688d1ac64fa653eb6220ea21591eb8cb850695c64b04d95853d527
Private key: d46c33e69e0bd21de8cb969eb395bdf0d86c6727d73db917436508e42963bc74
Digest function: secp256k1
```

::: details Working with Kagami

Since there is currently no `kagami` package available, if you want to copy
the program somewhere convenient e.g. `/bin` for system-wide use you need
to build it first:

```bash
$ cargo build --bin kagami
```

To move the `kagami` executable to the system's bin directory, making it
globally available, type:

```bash
$ sudo mv kagami /bin
```

You can also move `kagami` to your user's `.local/bin` directory, so it
would only be available in your user's shell session:

```bash
$ mv target/debug/kagami ~/.local/bin
```

If you want to use `kagami` from your user's directory, make sure that
`~/.local/bin` directory is available in your shell's `.rc` file, be it
`~/.bashrc` for [Bash](https://www.gnu.org/software/bash/) or `~/.zshrc`
for the [Z shell](https://www.zsh.org/).

```bash
# Check kagami is available
$ whereis kagami
kagami:
```

Fix the PATH variable for [Bash](https://www.gnu.org/software/bash/) and
reload the `.bashrc` script:

```bash
echo "export PATH='${HOME}/.local/bin:${PATH}'" >> ~/.bashrc
source ~/.bashrc
```

Fix the `PATH` variable for the [Z shell](https://www.zsh.org/) and reload
the `.zshrc` script:

```bash
echo "export PATH='${HOME}/.local/bin:${PATH}'" >> ~/.zshrc
source ~/.zshrc
```

Fix the `PATH` variable for the Fish permanently:

```bash
fish_add_path ~/.local/bin
```

:::

Check
[`kagami` documentation](https://github.com/hyperledger/iroha/tree/iroha2-dev/tools/kagami#crypto)
for more details.

## Keys for Deploying a Network

Keeping in mind what we said above about key cryptography, note that if
you're deploying your own network, you should change the keys in all three
configuration files:

- peer configuration: [`configs/peer/config.json`](./peer-configuration.md)
- client configuration:
  [`configs/client_cli/config.json `](./client-configuration.md)
- genesis block: [`configs/peer/genesis.json`](./genesis.md)

### 1. Generate new key-pairs

To get new key-pairs, use the `iroha_crypto_cli` program:

```bash
cargo build -p iroha_crypto_cli
./target/debug/iroha_crypto_cli
```

This will print a fresh pair of keys.

::: info

You can also use `kagami` to generate the pair of keys:

```bash
cargo run --bin kagami -- crypto --json
```

Check
[`kagami` documentation](https://github.com/hyperledger/iroha/tree/iroha2-dev/tools/kagami#crypto)
for more details.

:::

If you're planning on using the `private_key` in a programming language, it
should be noted that both the `payload` of the `private_key` and the string
representation of the `public_key` are in hexadecimal. Keys are commonly
encoded using ASCII characters instead.

### 2. Update keys for each peer

If you want to set up your own network, you should change the keys for all
your peers: in `peer/config.json` change `PUBLIC_KEY` and `PRIVATE_KEY` to
the fresh pair. When you've done that, you should add the keys to the
`TRUSTED_PEERS` array in the same configuration file. Every peer that wants
to connect to the given peer from the outside must know its `PRIVATE_KEY`
specified in the `TRUSTED_PEERS` section.

Let's consider an example of a minimum viable
[BFT](/guide/glossary.md#byzantine-fault-tolerance-bft) network. In this
network you have four peers, so that means that you need to create _four_
different peer configuration files (`config.json`).

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
register a non-genesis account (for example, _alice_@wonderland) and
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

Let's talk about how keys are used in the client.

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
