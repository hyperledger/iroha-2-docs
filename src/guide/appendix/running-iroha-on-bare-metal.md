# Running Iroha on bare metal

## Pre-requisites

Having read most of the appendix, you are now prepared to start Iroha in a
more advanced mode. What we are going to do is replicate the set up that we
have in the `docker compose`, except we don’t go through the intermediary
of containers, and run Iroha directly. Running iroha on bare metal involves
manipulating files and/or environment variables. What follows is an attempt
to run Iroha on bare metal, using either of two methods. We shall first
focus on the file-based approach, as it is the easiest to get right. We
shall then show you how to do the same using environment variables, which
can offer a better user experience if done right, but is more error-prone,
particularly for exotic systems. First of all, we should note that we have
only built the Iroha client so far. To build the peer software you should
run

```kotlin
cargo build -p iroha
```

This will build Iroha in `debug` mode, containing many more debug-oriented
features and very few (if any) compiler optimisations. A debug build is
faster to compile, but if you intend to actually deploy Iroha, you should
build it in `--release` mode like so

```kotlin
cargo build -p iroha --release
```

This will take significantly longer, but should produce both a smaller and
faster binary, suitable for deployment in the actual blockchains.

## Environment variables: set-up

Next we want to make sure that we have the right configuration. To do that,
it’s a good idea to either copy the contents of the
`~/Git/iroha/configs/peer/` into a new directory, or alternatively to just
run all commands from that directory: `cd ~/Git/iroha/configs/peer`. A
third option is to specify the full path to the configuration in an
environment variable. For simplicity we shall do the latter:

```bash
cd ~
export IROHA2_GENESIS_PATH="$(pwd)/Git/iroha/configs/peer/genesis.json"
export IROHA2_CONFIG_PATH="$(pwd)/Git/iroha/configs/peer/config.json"
```

For extra convenience, you could add the Iroha 2 `target` directory to your
`PATH`. This means that instead of having to specify the full path to the
executable `iroha` you can instead type `iroha` directly into your command
line. ::: tip

Don’t forget to replace `debug` with `release` when you’re ready to deploy
in the real world.

:::

```bash
export PATH="$PATH:$(pwd)/Git/iroha/target/debug"
```

This way you can run `iroha` from any directory, without having to worry
about configuration paths and/or specifying the full path to the Iroha
executable.

The instructions here should probably be made permanent, which you can do
by adding the following environment variables to your startup shell. On
older Linux systems, you copy and paste everything except `cd ~` to
`~/.bashrc`. On macs running Mac OS X 10.6 and later, as well as some Linux
systems, you want to add the same lines to `~/.zshrc`.

::: tip

This process is almost universally unreliable and messy, and it’s likely
that your system is special in that it breaks some of our assumptions. If
the above optional steps didn’t work for you, you can keep working in the
`~/Git/iroha/configs/peer/` folder, and run iroha by doing
`~/Git/iroha/target/debug/iroha`. This makes the command-line a little
harder to read, which is why we recommend settin up your environment first.

:::

::: info Note

The tutorial assumes that you’re running either Linux, Mac OS X, or Windows
using WSL. It should be possible to run directly on Windows, but that is
neither recommended nor easy. If you don’t want to use a Unix-like system,
we suggest that you wait until we publish a detailed guide for Windows
users.

:::

## Files: set-up

This is the recommended method of bringing up an Iroha peer. What we do is
create a new directory for the configuration files,

```bash
mkdir -p ~/Git/iroha/deploy
```

and copy the `peer` configuration into it.

```bash
cp -vfr ~/Git/iroha/configs/peer/*.json ~/Git/iroha/deploy
```

also we copy the respective iroha binary into your binary folder

```bash
sudo cp -vfr ~/Git/iroha/target/debug/iroha /usr/bin/
```

which will install Iroha 2 system wide.

::: tip

You could also use the iroha peer binary locally, by copying it into the
same folder. The only difference would be that you’d be calling Iroha like
so: `./iroha` instead of `iroha`.

:::

## First run of Iroha on bare metal

If you’ve done everything correctly, you can now do

```bash
iroha
```

to start your first peer and be greeted with

<!-- FIXME untitled -->

![Untitled](/img/appendix_running-iroha_cli-output.png)

This means that everything is working, but also that we need to do some
more work. You have just started a single peer, which can tolerate exactly
0 faults. Running two peers is also possible, but again, can tolerate 0
faults. You must run at least 4 peers in order to have the capacity to
tolerate at least one fault. In general, if you want to be resistant to `f`
faults, you want to have `3f+1` peers: (4, 7, 10 etc.). You can’t really
start them in any way you want, though. When we started our original peer,
in its configuration, we specified that it has to trust very specific
peers, which have the given private key and listen on a specific address.
In order to know how to run them appropriately, take a look at
`docker-compose.yml`.

::: details docker-compose.yaml

```yaml
version: '3.3'
services:
  iroha0:
    image: hyperledger/iroha2:dev
    environment:
      TORII_P2P_ADDR: iroha0:1337
      TORII_API_URL: iroha0:8080
      TORII_STATUS_URL: iroha0:8180
      IROHA_PUBLIC_KEY: 'ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0'
      IROHA_PRIVATE_KEY:
        '{"digest_function": "ed25519", "payload":
        "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}'
      SUMERAGI_TRUSTED_PEERS:
        '[{"address":"iroha0:1337", "public_key":
        "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},
        {"address":"iroha1:1338", "public_key":
        "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"},
        {"address": "iroha2:1339", "public_key":
        "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"},
        {"address": "iroha3:1340", "public_key":
        "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
    ports:
      - '1337:1337'
      - '8080:8080'
      - '8180:8180'
    command: ./iroha --submit-genesis

  iroha1:
    image: hyperledger/iroha2:dev
    environment:
      TORII_P2P_ADDR: iroha1:1338
      TORII_API_URL: iroha1:8081
      TORII_STATUS_URL: iroha1:8181
      IROHA_PUBLIC_KEY: 'ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1'
      IROHA_PRIVATE_KEY:
        '{"digest_function": "ed25519", "payload":
        "3bac34cda9e3763fa069c1198312d1ec73b53023b8180c822ac355435edc4a24cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}'
      SUMERAGI_TRUSTED_PEERS:
        '[{"address":"iroha0:1337", "public_key":
        "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},
        {"address":"iroha1:1338", "public_key":
        "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"},
        {"address": "iroha2:1339", "public_key":
        "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"},
        {"address": "iroha3:1340", "public_key":
        "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
    ports:
      - '1338:1338'
      - '8081:8081'
      - '8181:8181'

  iroha2:
    image: hyperledger/iroha2:dev
    environment:
      TORII_P2P_ADDR: iroha2:1339
      TORII_API_URL: iroha2:8082
      TORII_STATUS_URL: iroha2:8182
      IROHA_PUBLIC_KEY: 'ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020'
      IROHA_PRIVATE_KEY:
        '{"digest_function": "ed25519", "payload":
        "1261a436d36779223d7d6cf20e8b644510e488e6a50bafd77a7485264d27197dfaca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}'
      SUMERAGI_TRUSTED_PEERS:
        '[{"address":"iroha0:1337", "public_key":
        "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},
        {"address":"iroha1:1338", "public_key":
        "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"},
        {"address": "iroha2:1339", "public_key":
        "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"},
        {"address": "iroha3:1340", "public_key":
        "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
    ports:
      - '1339:1339'
      - '8082:8082'
      - '8182:8182'

  iroha3:
    image: hyperledger/iroha2:dev
    environment:
      TORII_P2P_ADDR: iroha3:1340
      TORII_API_URL: iroha3:8083
      TORII_STATUS_URL: iroha3:8183
      IROHA_PUBLIC_KEY: 'ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f'
      IROHA_PRIVATE_KEY:
        '{"digest_function": "ed25519", "payload":
        "a70dab95c7482eb9f159111b65947e482108cfe67df877bd8d3b9441a781c7c98e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}'
      SUMERAGI_TRUSTED_PEERS:
        '[{"address":"iroha0:1337", "public_key":
        "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},
        {"address":"iroha1:1338", "public_key":
        "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"},
        {"address": "iroha2:1339", "public_key":
        "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"},
        {"address": "iroha3:1340", "public_key":
        "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
    ports:
      - '1340:1340'
      - '8083:8083'
      - '8183:8183'
```

:::

For every peer, the `environment` section is the set of things that you
should put in front of the `iroha` command, replacing colons with equals
signs. All the socket addresses are also given internal to the docker
network, so we should replace them with `[localhost](http://localhost)`
which is `127.0.0.1` on most machines.

::: tip

Each Iroha instance is going to listen on three ports: the Peer-to-peer
communications channel (`133X`), the API url, where most client requests
are posted (`808X`), and finally, a telemetry endpoint `818X`. All three
ports need to be adjusted so there are no collisions. See the
`docker-compose.yml` for an example, and adjust as needed.

:::

## Environment Variables: deploy a minimal BFT network

So to run the First peer, we need to write

```bash
TORII_P2P_ADDR="127.0.0.1:1337"
TORII_API_URL="127.0.0.1:8080"
TORII_STATUS_URL="127.0.0.1:8180"
IROHA_PUBLIC_KEY="ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0" IROHA_PRIVATE_KEY='{"digest_function": "ed25519", "payload": "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}'
iroha --submit
```

and three other similar lines of bash for the remaining deployments.

::: tip

To copy and paste into the terminal on Linux systems, you should remember
that `Control + **shift** + V` is the appropriate `paste` shortcut.

:::

Also note that we asked this peer to `--submit` or `--submit-genesis`. This
means that in the initial network topology, this peer is the leader. At
least one peer (usually the first) needs to be the leader in the initial
topology.

Now you should do the same for the other four peers. Be mindful not to mix
up which address goes which, replace `irohaX` with `127.0.0.1` in the
addresses, and make sure that they correspond to the right public key.

This is messy, and error-prone, which is why the tutorial uses
`docker-compose`. However, this brings you closer to the experience of
actually maintaining a functional Iroha peer.

## Files: deploy a minimal BFT network

Our first peer can run off of the original configuration file. What we
should do is create three more similar files and move them to three
different folders e.g. `peer1`, `peer2`. What you need to do is change the
`TORII:P2P_ADDR`, `TORII:API_URL` `TORII:STATUS_URL` and the `PUBLIC_KEY`
configuration options to align with their `docker-compose.yml`
counterparts. Then in each of the new folders (`peer1`, `peer2` etc.) run:

```bash
iroha
```

except for one. In the first folder `peer0` you should instead run

```bash
iroha --submit-genesis
```

We effectively asked this peer to `--submit` or `--submit-genesis` in the
initial or _bootstrap_ network. This means that in the initial network
topology, this peer is the leader.

::: info Note

Only the leader of the genesis network needs to have access to
`genesis.json`. Having the same genesis in the initial folders of the other
peers could be useful, since future versions of `iroha` will also
sanity-check the genesis blocks.

Now you should do the same for the other four peers. Be mindful not to mix
up which address goes which, replace `irohaX` with `127.0.0.1` in the
addresses, and make sure that they correspond to the right public key.

This is messy, and error-prone, which is why the tutorial uses
`docker-compose`. However, this brings you closer to the experience of
actually maintaining a functional Iroha peer.

If all went well, you should be greeted with nice logs on each of the
nodes, and the nodes should commit the blocks to the `blocks/` directory.

## Real-world deployment

Suppose now, that you have done all of the tinkering and want to deploy
Iroha in the real world. Firstly, you should build it in release mode:

```bash
cargo build --release
```

Secondly, you want to generate a key pair for your peer:

```bash
cargo run --bin iroha_crypto_cli
```

And take not of that key. Thirdly, you should register your peer to a
network, and make sure to add at least four of the peers on that network to
the `TRUSTED_PEERS` array in your configuration file. You then determine
the web socket that the other peers will use to connect to you. Make sure
that the port is open and use that Address in your `config.json`. Finally,
after you finished editing the configuration file iroha is deployed by
running

```bash
~/Git/iroha/target/release/iroha
```

::: info Note There’s no need to pass the `--submit` flag, unless you are
starting the initial peer on the network. :::
