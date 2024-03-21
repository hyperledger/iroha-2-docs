# Working with Iroha Binaries

When working with Iroha, certain components (e.g., `iroha_client_cli`) are delivered as binary files that could not only be built and installed as standalone tools locally, but also come prepackaged with any of the official versions of Iroha 2 (`dev`, `lts`, or `stable`).

::: info

For details on the differences between the versions of Iroha 2, see [Get Started > Install Iroha 2: Choose Version](guide/get-started/install.md#choose-version).

:::

The Iroha 2 project provides the following binary executables:

- [`iroha`](https://github.com/hyperledger/iroha/tree/iroha2-dev/cli) — the main Iroha CLI that is used to instantiate a peer and bootstrap an Iroha-based network.
- [`iroha_client_cli`](https://github.com/hyperledger/iroha/tree/iroha2-dev/client_cli) — Iroha Client CLI that is used to interact with the Iroha Peers Web API (Q: certain operations within Torii? (i.e., submmitting transactions with ISI, query requests)), and serves as a reference for using the features of the [iroha_client](https://github.com/hyperledger/iroha/tree/iroha2-dev/client) crate.
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
- [Docker Compose](https://docs.docker.com/compose/install/)

To install a binary from a pre-built Docker image, execute one of the following commands:

::: code-group

```shell [iroha]
docker run -t hyperledger/iroha2:dev
```

```shell [iroha_client_cli]
docker run -t hyperledger/iroha2:client-cli-dev
```

```shell [kagami]
docker run -t hyperledger/iroha2:kagami-dev
```

:::

::: info

Listed examples only reference the `dev` versions of the Docker images.

For a list of all available Docker images for Iroha 2, see the [Iroha 2 Docker Hub](https://hub.docker.com/r/hyperledger/iroha2) page.

:::

## Using the Source GitHub Repository {#source}

To perform any of the actions with the GitHub repository (i.e., [building & installing](#source-install), or [running](#source-run) binaries), the [Rust toolchain](https://www.rust-lang.org/) must first be installed. The toolchain is delivered with the package manager—[Cargo](https://doc.rust-lang.org/cargo/index.html)—that allows for installation of Rust crates from different sources, including GitHub.

The recommended way to install the Rust toolchain is through a Rust installer and version management tool—[Rustup](https://rust-lang.github.io/rustup/) (See also: [Install Rust](https://www.rust-lang.org/tools/install))—by executing the following command in your terminal:

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

```shell [`iroha`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev iroha

iroha --help
```

```shell [`iroha_client_cli`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev iroha_client_cli

iroha_client_cli --help
```

```shell [`kagami`]
cargo install --git https://github.com/hyperledger/iroha.git --branch iroha2-dev kagami

kagami --help
```

:::

::: info

Listed examples only reference the `dev` versions of the Iroha 2 binaries.

To install a different version of a binary, specify the corresponding branch (i.e., `iroha2-lts` or `iroha2-stable`) when executing the `cargo install` command.

:::

::: tip

For more details on `cargo install` and its `[options]`, see [The Cargo Book > cargo install](https://doc.rust-lang.org/cargo/commands/cargo-install.html).

:::

### Running from Cloned GitHub Repository {#source-run}

First, clone the [hyperledger / iroha](https://github.com/hyperledger/iroha.git) GitHub repository, then checkout the required branch (`dev`, `lts`, or `stable`):

```shell
git clone https://github.com/hyperledger/iroha.git <clone-folder>
cd <clone-folder>
git checkout iroha2-dev
```

To run an Iroha 2 binary with `cargo install`, execute one of the following commands in your terminal:

::: code-group

```shell [Command structure]
cargo run [options] [binary name] -- [arguments for the binary]
```

```shell [Iroha]
cargo run -p iroha --release -- --help
```

```shell [Client CLI]
cargo run -p iroha_client_cli --release -- --help
```

```shell [Kagami]
cargo run -p kagami --release -- --help
```

::: tip

For more details on `cargo run` and its `[options]`, see [The Cargo Book > cargo run](https://doc.rust-lang.org/cargo/commands/cargo-run.html).

:::

:::

**TODO:**

- Wait until stable/dev/lts channels are abandoned, update branches and image tags
- Update `docker run` commands, make sure they work

Q:
1. Бинарниками считаются только `iroha`, `iroha_client_cli` & `kagami`?
   Крейты отсюда -- https://github.com/hyperledger/iroha/blob/iroha2-dev/README.md#integration -- нельзя use from source repo? (В Докере их точно нет раздельно)