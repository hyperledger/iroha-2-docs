# 0. Build and Install Iroha 2

## Install the rust build tools

This is normally straightforward. Sometimes it’s not.
Usually, it’s enough to do either:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

or to install rust via your distribution’s package manager.

If you install the latest stable rust (the default) with `cargo` you should be all set to build Iroha.

## Troubleshooting the rust toolchain

Sometimes, that doesn’t work. Python and rust are very flexible in terms of what you can do, so you could have both a user a system-wide and on macs even multiple system-wide installations. XKCD has a famous example of what that might look like.

<!-- Please rename file and add an appropriate label to it -->

![Untitled](/img/install-troubles.png)

In the interest of preserving both your and our sanity, make sure that you have the right version of `cargo` paired with the right version of `rustc` (1.57 and 1.57) respectively. To show the versions, do

```bash
cargo -V
cargo 1.57.0 (b2e52d7ca 2021-10-21)
```

and then

```bash
rustc --version
rustc 1.57.0 (f1edd0429 2021-11-29)
```

If you get lower version numbers **and** you could swear that you installed the right versions, it means that you have fallen victim to the plight of most Python (and some rust) developers.

Firstly, you should establish where the version that you want to use is installed.

```bash
rustup which rustc
rustup which cargo
```

should give you some idea. As a rule of thumb, the user installations of the toolchains are in `~/.rustup/toolchains/stable-*/bin/`. If that is the case, you should be able to run

```bash
rustup toolchain update stable
```

and that should fix your problems. If it’s not, it could be because of a shell alias. To know if that’s the case, try

```bash
type rustc
type cargo
```

If these point to locations other than the one you saw when running `rustup which *`, then you have a problem. It’s not enough to just

```bash
alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

because there is internal logic that could break regardless of how you re-arrange your shell aliases.

The simplest solution would be to remove the versions that you don’t use. Easier said than done, however, since that means that you need to track all the versions of rustup installed and available to you. Usually, there can be two: the system package manager and the one that got installed into the standard location in your home folder. For the former, consult your distribution’s manual, (`apt remove rust`). For the latter,

```bash
rustup toolchain list
```

and

```bash
rustup remove <toolchain>
```

for every `<toolchain>` , (without the angle brackets of course).

After that, make sure that

```bash
cargo --help
```

results in a command-not-found error, i.e. that you have no active rust toolchain installed. Then, run

```bash
rustup toolchain install stable
```

If after all of this work, you still don’t seem to have the right version, then the issue runs deeper.

## Install Iroha from GitHub

If you haven't already, you might want to create a clean folder for Iroha 2, to keep things tidy.

```bash
mkdir -p ~/Git
```

::: tip
On macs, if you get `fatal: could not create work tree dir 'iroha': Read-only file system`, that's because the home folder is not a real file system. The fix is to create the `Git` folder
:::

Enter the directory you have just created using

```bash
cd ~/Git
```

Then `clone` the Iroha git repository into the folder `~/Git/iroha`.

```bash
git clone https://github.com/hyperledger/iroha.git
```

This will fetch all of Iroha, including Iroha 1, and the `iroha2-dev` branch, which we will touch upon later.

Change directories

```bash
cd ~/Git/iroha
```

and choose the right branch: the 1st preview release of Iroha 2!

```bash
git checkout "2.0.0-pre.1.rc.1"
```

After you have successfully cloned the Iroha git repository, and are on the correct branch, build the Iroha 2 client using:

```bash
cargo build -p iroha_client_cli
```

::: info

We take pride in the fact that Iroha is extremely quick to compile. For reference, compiling hyperledger/substrate takes a good part of ten minutes to compile on a modern M1 machine. Iroha, for comparison compiles in around 1.

:::

You can run Iroha directly on bare metal, but we recommend bringing up a network of 4 containerised peers using `docker-compose` . Of course, installing Docker might seem like a daunting task, but it allows for reproducible management of configurations, which is oftentimes tricky on bare metal. Please consult the [appendix](https://www.notion.so/IROHA2-Walkthrough-180d09fb04a647bfa3f4d30218e6e94a) for how to do that.

```bash
docker compose up
```

::: info

On a _properly_ set up docker compose, you should never have to use `sudo` . If you do, consider looking into starting the docker dæmon first by running `systemctl enable docker` on Linux.

:::

Depending on your set-up, this might either pull the container off of DockerHub, or build the container locally. After this (relatively short if pull, and long if build) process is complete, you'll be greeted with,

<!-- Please rename file and add an appropriate label to it -->

![Untitled](/img/install-cli.png)

::: tip
When you're done with test network, just hit `Control + C` to stop the containers (`^ + C` on Mac).
:::
