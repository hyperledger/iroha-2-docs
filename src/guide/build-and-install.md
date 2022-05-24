# Build and Install Iroha 2

## Prerequisites

For this tutorial, you will need:

- [git](https://githowto.com/)
- [A working Rust toolchain](https://www.rust-lang.org/learn/get-started):
  `cargo`, `rustc` v1.60 and up [^1]
- (Optional) [Docker](https://docs.docker.com/get-docker/)
- (Optional) [Docker compose](https://docs.docker.com/compose/) [^2]

[^1]:
    If you’re having issues with installing Rust compatible with our code
    (2021 edition), please consult the troubleshooting section.

[^2]:
    We highly recommend using Docker, because it's oftentimes easier to use
    and debug.

## Install the Rust Toolchain

This is normally a straightforward process. This is not always true, so
we've added some details for troubleshooting at each stage.

The easiest way to get the official `rustup` script is to

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

or to install `rustup` via your distribution’s package manager.

::: tip

If you know what you're doing, you can also install the rust toolchain
directly, without `rustup`.

:::

If you go with the one-line `curl` script, you will be guided through the
setup process. Just go with the defaults.

## Troubleshooting: Rust toolchain

Sometimes, things don't go to plan. Especially if you had `rust` on your
system a while ago, but didn't upgrade. A similar problem can occur in
Python: XKCD has a famous example of what that might look like.

<div class="flex justify-center">

<!-- FIXME untitled -->

![Untitled](/img/install-troubles.png)

</div>

In the interest of preserving both your and our sanity, make sure that you
have the right version of `cargo` paired with the right version of `rustc`
(1.57 and 1.57) respectively. To show the versions, do

```bash
cargo -V
cargo 1.60.0 (d1fd9fe 2022-03-01)
```

and then

```bash
rustc --version
rustc 1.60.0 (7737e0b5c 2022-04-04)
```

If you have higher versions, you're fine. If you have lower versions, you
can run

```bash
rustup toolchain update stable
```

to update.

If you get lower version numbers **and** you updated the toolchain and it
didn't work… let's just say it's a common problem, but it doesn't have a
common solution.

Firstly, you should establish where the version that you want to use is
installed.

```bash
rustup which rustc
rustup which cargo
```

should give you some idea. As a rule of thumb, the user installations of
the toolchains are in `~/.rustup/toolchains/stable-*/bin/`. If that is the
case, you should be able to run

```bash
rustup toolchain update stable
```

and that should fix your problems. But, if you're reading this, it's
reasonable to assume that it didn't.

Another option is that you have the up-to-date `stable` toolchain, but it's
not set as the default.

```bash
rustup default stable
```

this can happen if you installed a `nightly` version or set a specific Rust
version, but forgot to un-set it.

Continuing down the troubleshooting rabbit-hole, we could have shell
aliases.

```bash
type rustc
type cargo
```

If these point to locations other than the one you saw when running
`rustup which *`, then you have a problem. It’s not enough to just

```bash
alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

because there is internal logic that could break regardless of how you
re-arrange your shell aliases.

The simplest solution would be to remove the versions that you don’t use.
It's Easier _said_ than _done_, however, since it entails tracking all the
versions of rustup installed and available to you. Usually, there are only
two: the system package manager version and the one that got installed into
the standard location in your home folder when you ran the command in the
beginning of this tutorial. For the former, consult your (Linux)
distribution’s manual, (`apt remove rust`). For the latter,

```bash
rustup toolchain list
```

and

```bash
rustup remove <toolchain>
```

for every `<toolchain>`, (without the angle brackets of course).

After that, make sure that

```bash
cargo --help
```

results in a command-not-found error, i.e. that you have no active rust
toolchain installed. Then, run

```bash
rustup toolchain install stable
```

If after all of this work, you still don’t seem to have the right version,
then the issue runs deeper.

## Install Iroha from GitHub

If you haven't already, you might want to create a clean folder for Iroha
2, to keep things tidy.

```bash
mkdir -p ~/Git
```

::: tip On macs, if you get
`fatal: could not create work tree dir 'iroha': Read-only file system`,
that's because the home folder is not a real file system. The fix is to
create the `Git` folder :::

Enter the directory you have just created using

```bash
cd ~/Git
```

Then `clone` the Iroha git repository into the folder `~/Git/iroha`.

```bash
git clone https://github.com/hyperledger/iroha.git
```

This will fetch all of Iroha, including Iroha 1, and the `iroha2-dev`
branch, which we will touch upon later.

Change directories

```bash
cd ~/Git/iroha
```

and choose the right branch: the main and the latest currently supported
monthly release of Iroha.

```bash
git checkout iroha2
```

After you have successfully cloned the Iroha git repository, and are on the
correct branch, build the Iroha 2 client using:

```bash
cargo build -p iroha_client_cli
```

::: info

We take pride in the fact that Iroha is extremely quick to compile. For
reference, compiling hyperledger/substrate takes a good part of ten minutes
to compile on a modern M1 machine. Iroha, for comparison compiles in
around 1.

:::

### Bring up a minimal network

You can run Iroha directly on bare metal, but we recommend bringing up a
network of 4 containerised peers using `docker-compose` . Of course,
installing Docker might seem like a daunting task, but it allows for
reproducible management of configurations, which is oftentimes tricky on
bare metal. Follow instructions on
[how to run Iroha on bare metal](/guide/advanced/running-iroha-on-bare-metal).

```bash
docker compose up
```

::: info

On a _properly_ configured
[docker compose](https://docs.docker.com/engine/install/linux-postinstall/),
you should never have to use `sudo` . If you do, consider looking into
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
we recommend that you don't go this route.

Unless you have an absolute aversion to `docker`, it's easier to work with,
easier to set up, and easier to debug. We try to cater to all tastes, but
some tastes have objective advantages.
