# Build Iroha 2 Client

After you have [installed Iroha](./install.md) from GitHub, follow these
instructions to build the Iroha 2 client:

1. [Install the Rust Toolchain](#install-the-rust-toolchain)
2. [Build Iroha 2 Client](#build-iroha-client)

## Install the Rust Toolchain

You need
[a working Rust toolchain](https://www.rust-lang.org/learn/guide/get-started):
`cargo`, `rustc` v1.60 and up. [^1]

[^1]:
    If you're having issues installing Rust compatible with our code
    (2021 edition), please consult the
    [troubleshooting](/guide/troubleshooting/installation-issues#troubleshooting-rust-toolchain) section.

Installing the Rust Toolchain is normally a straightforward process, but
we've added
[troubleshooting](/guide/troubleshooting/installation-issues#troubleshooting-rust-toolchain)
details for each stage, in case you experience issues with the installation
process.

The easiest way to get the official `rustup` script is to run:

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Or, alternatively, you can install `rustup` via your operating system’s
package manager.

::: tip

If you know what you're doing, you can also install the Rust toolchain
directly, without `rustup`.

:::

If you chose to use the one-line `curl` script, you will be guided through
the setup process. Just go with the defaults.

## Build Iroha Client

1. Navigate to the directory containing the Iroha repository. If you
   followed the installation instructions
   [here](./install.md#install-iroha-from-github), run:

   ```bash
   $ cd ~/hyperledger/iroha
   ```

2. Build the Iroha 2 client using:

   ```bash
   $ cargo build -p iroha_client_cli --release
   ```

   Build artifacts are created in the `./target/debug/` directory.

   ::: info

   We take pride in the fact that Iroha is extremely quick to compile. For
   reference, compiling hyperledger/substrate takes a good part of ten
   minutes on a modern M1 machine. Iroha, in comparison, compiles in around
   one minute.

   :::
