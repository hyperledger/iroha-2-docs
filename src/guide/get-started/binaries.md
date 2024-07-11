# Working with Iroha Binaries

When working with Iroha, certain components (e.g., `iroha_client_cli`) are delivered as binary files that can be built and installed as standalone tools locally, and also come prepackaged with  Iroha 2.

::: info

For details on the differences between the versions of Iroha 2, see [Get Started > Install Iroha 2: Choose Version](guide/get-started/install.md#choose-version).

:::

Iroha 2 provides the following binary executables:

- [`iroha`](https://github.com/hyperledger/iroha/tree/iroha2-dev/cli) — the main Iroha CLI that is used to start a peer.
- [`iroha_client_cli`](https://github.com/hyperledger/iroha/tree/iroha2-dev/client_cli) — Iroha Client CLI that is used to interact with an Iroha peer.
- [`kagami`](https://github.com/hyperledger/iroha/tree/iroha2-dev/tools/kagami) — a tool that is used to generate and validate various types of data (e.g., cryptographic keys, genesis blocks, default client and peer configuration files).
  > See also:
  > - [Generating Cryptographic Keys](guide/security/generating-cryptographic-keys.md) — instructions on how to generate cryptographic keys with `kagami`.
  > - [Configure Iroha > Genesis Block: Generation](guide/configure/genesis.md#generation) — instructions on how to generate a default genesis block with `kagami`.
  > - [Configure Iroha > Peer Configuration: Generation](guide/configure/peer-configuration.md#generation) — instructions on how to generate a default peer configuration file with `kagami`.
  > - [Configure Iroha > Client Configuration: Generation](guide/configure/client-configuration.md#generation) — instructions on how to generate a default client configuration file with `kagami`.

There are two main ways to work with Iroha 2 binaries:

1. [Using the pre-built Docker images](#docker-install).
2. [Using the source GitHub repository](#source):
   - [Installing from source GitHub repository](#source-install).
   - [Running from cloned GitHub repository](#source-run).

## Using the Pre-Built Docker Images {#docker-install}

First, install the following Docker prerequisites:

- [Docker](https://docs.docker.com/get-docker/)

To install a binary from a pre-built Docker image, execute one of the following commands:

::: code-group

```shell [`iroha`]
docker run -t hyperledger/iroha2:dev
```

```shell [`iroha_client_cli`]
docker run -t hyperledger/iroha2:client-cli-dev
```

```shell [`kagami`]
docker run -t hyperledger/iroha2:kagami-dev
```

## Using the Source GitHub Repository {#source}

To perform any of the actions using the GitHub repository (i.e., [building & installing](#source-install), or [running](#source-run) binaries), the [Rust toolchain](https://www.rust-lang.org/) must first be installed. The toolchain is delivered with the package manager—[Cargo](https://doc.rust-lang.org/cargo/index.html)—that allows for installation of Rust crates from different sources, including GitHub.

The recommended way to install the Rust toolchain is through the Rust installer and version management tool—[Rustup](https://rust-lang.github.io/rustup/) (See also: [Install Rust](https://www.rust-lang.org/tools/install))—by executing the following command in your terminal:

  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

::: info

Depending on the operating system that you are using or other limitations, you may want to opt for a different installation method.

For all available installation methods, see the [Rust Forge: Other Rust Installation Methods](https://forge.rust-lang.org/infra/other-installation-methods.html) article.

In case you experience any issues with Rust installation, see our [Troubleshooting Rust Toolchain](/guide/troubleshooting/installation-issues#troubleshooting-rust-toolchain) topic.

:::

### Installing from Source GitHub Repository {#source-install}

To perform a system-wide installation of an Iroha 2 binary with `cargo install`, execute one of the following commands in your terminal:

::: code-group

```shell [Command structure]
cargo install [options] --git [repo url] --branch [branch name] [binary name]
```

```shell [`Iroha`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev iroha

iroha --help
```

```shell [`Iroha Client CLI`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev iroha_client_cli

iroha_client_cli --help
```

```shell [`Kagami`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev kagami

kagami --help
```

:::

::: tip

For more details on `cargo install` and its `[options]`, see [The Cargo Book > cargo-install(1)](https://doc.rust-lang.org/cargo/commands/cargo-install.html).

:::

### Running from Cloned GitHub Repository {#source-run}

First, clone the [hyperledger/iroha](https://github.com/hyperledger/iroha.git) GitHub repository:

```shell
git clone https://github.com/hyperledger/iroha.git <clone-folder>
cd <clone-folder>
git checkout iroha2-dev
```

To run an Iroha 2 binary with `cargo install`, execute one of the following commands in your terminal:

::: code-group

```shell [Command structure]
cargo run [options] --bin [binary name] -- [arguments for the binary]
```

```shell [Iroha]
cargo run --release --bin iroha -- --help
```

```shell [Client CLI]
cargo run --release --bin iroha_client_cli -- --help
```

```shell [Kagami]
cargo run --release --bin kagami -- --help
```

:::

::: tip

For more details on `cargo run` and its `[options]`, see [The Cargo Book > cargo-run(1)](https://doc.rust-lang.org/cargo/commands/cargo-run.html).

:::
