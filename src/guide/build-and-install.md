# Build and Install Iroha 2

## Prerequisites

For this tutorial, you will need:

- [git](https://githowto.com/)
- [A working Rust toolchain](https://www.rust-lang.org/learn/get-started):
  `cargo`, `rustc` v1.60 and up [^1]
- [OpenSSL](https://www.openssl.org/)
- (Optional) [Docker](https://docs.docker.com/get-docker/)
- (Optional) [Docker compose](https://docs.docker.com/compose/) [^2]

[^1]:
    If you're having issues with installing Rust compatible with our code
    (2021 edition), please consult the
    [troubleshooting](#troubleshooting-rust-toolchain) section.

[^2]:
    We highly recommend using Docker because it is oftentimes easier to use
    and debug.

## Install the Rust Toolchain

This is normally a straightforward process, but we've added
[troubleshooting](./troubleshooting/installation-issues.md#troubleshooting-rust-toolchain)
details for each stage in case you experience issues with the installation
process.

The easiest way to get the official `rustup` script is to run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Or, alternatively, you can install `rustup` via your operating system’s
package manager.

::: tip

If you know what you're doing, you can also install the Rust toolchain
directly, without `rustup`.

:::

If you go with the one-line `curl` script, you will be guided through the
setup process. Just go with the defaults.

## Install OpenSSL

Make sure you have OpenSSL installed. Note that in most Linux setups it is
already available to you.

- Install OpenSSL on Ubuntu:

  ```bash
  sudo apt-get install libssl-dev
  ```

- Install OpenSSL on macOS using [brew](https://brew.sh/):

  ```bash
  brew install openssl
  ```

Check
[OpenSSL installation guide](https://github.com/openssl/openssl/blob/master/INSTALL.md)
for details.

## Install Iroha from GitHub

1.  If you haven’t already, you might want to create a clean folder for
    Iroha 2, to keep things tidy.

    ```bash
    mkdir -p ~/Git
    ```

    ::: tip

    On macOS, if you get
    `fatal: could not create work tree dir 'iroha': Read-only file system`,
    that’s because the home folder is not a real file system. The fix is to
    create the `Git` folder.

    :::

2.  Enter the directory you have just created using

    ```bash
    cd ~/Git
    ```

3.  Then `clone` the Iroha git repository into the folder `~/Git/iroha` and
    `checkout` the branch you prefer to work on. You can use the
    `iroha2-lts` branch, which is the long-term support release, or the
    latest stable release branch (`iroha2-stable`). To clone the repository
    and checkout the stable release, run:

    ```bash
    git clone https://github.com/hyperledger/iroha.git --branch iroha2-stable
    ```

    This will fetch all of Iroha, including Iroha 1, and the `iroha2-dev`
    branch, which we will touch upon later.

4.  Change directories:

    ```bash
    cd ~/Git/iroha
    ```

5.  After you have successfully cloned the Iroha git repository and are on
    the correct branch, build the Iroha 2 client using:

    ```bash
    cargo build -p iroha_client_cli
    ```

    Build artifacts are created in the `./target/debug/` directory.

    ::: info

    We take pride in the fact that Iroha is extremely quick to compile. For
    reference, compiling hyperledger/substrate takes a good part of ten
    minutes on a modern M1 machine. Iroha, for comparison, compiles in
    around one minute.

    :::

## Bring up a minimal network

You can run Iroha
[directly on bare metal](/guide/advanced/running-iroha-on-bare-metal), but
we recommend bringing up a network of 4 containerised peers using
`docker-compose`.

::: info

In this tutorial we only cover the default `docker-compose.yml` with the
image of Iroha 2. You might also be interested in other options for local
compilation:

- For testing Iroha code quickly, you can use `docker-compose-single.yml`,
  which starts a container with a single peer.
- For testing Iroha code in normal conditions, you can use
  `docker-compose-local.yml`, which starts 4 connected containers with
  peers.

Please note that there is an ongoing work to make our configurations for
Docker even more customizable with the help of Swarm.

<!-- Check: a reference about future releases or work in progress -->

:::

Of course, installing Docker might seem like a daunting task, but it allows
for reproducible management of configurations, which is oftentimes tricky
on bare metal.

<!-- Check Docker releases: `docker compose` is going to replace `docker-compose` -->

```bash
docker-compose up
```

::: info

On a _properly_ configured
[docker compose](https://docs.docker.com/engine/install/linux-postinstall/),
you should never have to use `sudo`. If you do, consider looking into
starting the docker dæmon first by running `systemctl enable docker` on
Linux.

:::

Depending on your set-up, this might either
[pull the image](https://hub.docker.com/r/hyperledger/iroha2/tags) off of
DockerHub, or build the container locally. After this process is complete,
you'll be greeted with,

<!-- Please rename file and add an appropriate label to it -->
<!-- TODO maybe use ASCIINEMA here? -->

![Untitled](/img/install-cli.png)

::: tip

When you're done with test network, just hit `Control + C` to stop the
containers (`^ + C` on Mac).

:::

As we said, you can also try and use the bare metal script. For testing we
use `scripts/test_env.sh setup`, which will also start a set of Iroha
peers. But that network is much harder to monitor, and unless you're
well-versed in `killall` and reading log files with a proper text editor,
we recommend that you don’t go this route.

Unless you have an absolute aversion to `docker`, it’s easier to work with,
easier to set up, and easier to debug. We try to cater to all tastes, but
some tastes have objective advantages.
