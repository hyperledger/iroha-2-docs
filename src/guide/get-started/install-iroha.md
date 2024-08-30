# Install Iroha

<!-- TODO: write a short intro, this shouldn't be empty (especially considering the formatting); e.g., describe that to "install" Iroha 2, the repo must be copied to the user's machine -->

## Prerequisites

To install and build Iroha from GitHub, the following must be installed first:
- [git](https://githowto.com/)
- [OpenSSL](https://www.openssl.org/)
- [Rust Toolchain](https://www.rust-lang.org/tools/install) (v1.60.0 or newer)

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
