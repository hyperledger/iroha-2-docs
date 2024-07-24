# Install Iroha 2

## Install Prerequisites

To install and build Iroha from GitHub, you need:

- [git](https://githowto.com/)
- [OpenSSL](https://www.openssl.org/)
- [Rust Toolchain](https://www.rust-lang.org/tools/install)

### Install OpenSSL

Make sure you have OpenSSL installed. Note that in most Linux setups it is already available to you.

- Install OpenSSL on Ubuntu:

  ```bash
  $ sudo apt-get install libssl-dev
  ```

- Install OpenSSL on macOS using [brew](https://brew.sh/):

  ```bash
  $ brew install openssl
  ```

Check the [OpenSSL installation guide](https://github.com/openssl/openssl/blob/master/INSTALL.md) for details.


### Install the Rust Toolchain

You need [a working Rust toolchain]: `cargo`, `rustc` v1.60 and up. [^1]

[^1]:
    If you're having issues installing Rust compatible with our code
    (2021 edition), please consult the
    [troubleshooting](/guide/troubleshooting/installation-issues#troubleshooting-rust-toolchain) section.


The easiest way to get the official `rustup` script is to run:

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

You will be guided through the setup process. Just go with the defaults.

## Install Iroha from GitHub

<!-- TODO: change recommended installation method to docker binaries/cargo install -->


1.  If you haven’t already, you might want to create a clean directory for
    Iroha 2, to keep things tidy.

    ```bash
    $ mkdir -p ~/Git
    ```

    ::: tip

    On macOS, if you get
    `fatal: could not create work tree dir 'iroha': Read-only file system`,
    that’s because the home directory is not a real file system. The fix is to
    create the `Git` directory.

    :::

2.  Enter the directory you have just created using

    ```bash
    $ cd ~/Git
    ```

3.  Then `clone` the Iroha git repository into the directory `~/Git/iroha`

    ```bash
    $ git clone https://github.com/hyperledger/iroha.git 
    ```

### Build Iroha 2 Client

1. Navigate to the directory containing the Iroha repository:

   ```bash
   $ cd ~/Git/iroha
   ```

2. Build the Iroha 2 client using:

   ```bash
   $ cargo build --release
   ```

   Build artifacts are created in the `./target/release/` directory.


## What's Next

- [Launch Iroha Network](./launch-iroha.md)
