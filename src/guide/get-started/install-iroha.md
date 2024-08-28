# Install Iroha 2

<!-- TODO: write a short intro, this shouldn't be empty (especially considering the formatting); e.g., describe that to "install" Iroha 2, the repo must be copied to the user's machine -->

## Install Prerequisites

To install and build Iroha from GitHub, the following must be installed:
- [git](https://githowto.com/)
- [OpenSSL](https://www.openssl.org/)
- [Rust Toolchain](https://www.rust-lang.org/tools/install) (v1.60.0 or newer)

### Install OpenSSL

Depending on your operating system, perform one of the following:

- On Ubuntu, run:

  ```bash
  $ sudo apt-get install libssl-dev
  ```

- Using [brew](https://brew.sh/) on macOS, run:

  ```bash
  $ brew install openssl
  ```

::: tip Note

In most UNIX-based distributions, the OpenSSL library comes preinstalled.

:::

::: info

For details on all installation methods, troubleshooting and other related information, see [OpenSSL: Build and Install](https://github.com/openssl/openssl/blob/master/INSTALL.md).

:::

### Install the Rust Toolchain

The recommended way to install the Rust toolchain is through the Rust installer and version management tool—[Rustup](https://rust-lang.github.io/rustup/) (See also: [Install Rust](https://www.rust-lang.org/tools/install))—by executing the following command in your terminal:

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Once executed, follow the on-screen instructions to finish installation.

::: tip Note

If you are experiencing issues installing Rust compatible with our code (2021 edition), see [Troubleshooting Rust Toolchain](/guide/troubleshooting/installation-issues#troubleshooting-rust-toolchain).

:::

## Clone Iroha from GitHub

<!-- TODO: change recommended installation method to docker binaries/cargo install -->

1. Create a new directory for Iroha 2:

   ```bash
   $ mkdir -p ~/Git
   ```

   ::: tip

   On macOS, if you get the `fatal: could not create work tree dir 'iroha': Read-only file system` error, that is because the home directory is not a real file system.

   The solution is to create a directory named `Git`.

   :::

2. Enter the directory that you created:

   ```bash
   $ cd ~/Git
   ```

3. Clone the [`iroha`](https://github.com/hyperledger/iroha) GitHub repository:

   ```bash
   $ git clone https://github.com/hyperledger/iroha.git
   ```

### Install Iroha 2 Binaries

<!-- TODO: consider adding a list of all available binaries with their respective descriptions (e.g., `iroha_swarm`, `kura_inspector`, etc.)  -->

To install any of the standalone Iroha 2 binaries system-wide, use the following commands:

```bash
$ cargo install --git https://github.com/hyperledger/iroha.git iroha
```

```bash
$ cargo install --git https://github.com/hyperledger/iroha.git kagami
```
