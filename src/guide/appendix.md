# Appendix

This section will cover the configuration files in the first section in more detail. There are three configuration files specifically: _peer configuration_, _genesis block_, and _client configuration_. Finally, keys within Iroha 2 will be covered, including their configuration and use.

## Peer Configuration

The peer configuration JSON `/configs/peer/config.json` is the file that determines how your blockchain operates: we won't look at it now, however, the only things that you need to worry about are the `TRUSTED_PEERS` , the `KURA` `BLOCK_STORE_PATH` , the `TORII` `P2P_ADDR` and `API_ADDR`.
The `PUBLIC_KEY` and `PRIVATE_KEY` options will be covered at a later stage. The remaining options are for tuning Iroha, so you don't want to touch them unless you know what you're doing.

### Trusted peers

Iroha is a blockchain ledger, and for it to work optimally and be Byzantine-fault tolerant with the maximum number of faults allowed, it needs to be started with a set number of peers: 4, 7, 10 … 3f+1, where f is the number of faults. So usually, when you want to start an Iroha deployment you should already know a number of peers that you can trust and join their blockchain. The way it works in the examples is that you specify in four`config.json` files four peers with their public keys and API addresses.
Since Iroha doesn't have automatic peer discovery, the only other way to make peers known to each other is to use the `iroha_client_cli` to register new peers. This is not difficult with the provided client libraries. In fact, using Python’s beautiful soup, the curated list of peers can be updated, registered and un-registered on its own.

### Kura

Kura is the “warehouse” engine of Iroha; it can store blocks in custom locations, if for some reason `./blocks` is not available or desirable. There are plans to make Iroha’s storage tiered: when you reach a certain number of blocks, they get moved elsewhere.
The `KURA` init mode at present does nothing. In the future, it will affect whether or not your block storage does a `strict` initialisation: checks everything, or a `fast` one, where everything is “probably alright™”.

### Iroha public addresses

The gatekeeper `TORII` is the module in charge of handling incoming and outgoing connnections.
The `API_URL` is the location where the client(s) makes their request(s). You can use it to change some peer-specific configuration options too. While we could give you the examples here, the only up-to-date description can be found in the Iroha’s immediate [documentation on GitHub](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/api_spec.md). Most of the time, the only reason to change the `API_URL` is to change the port, in case `8080` is either closed, or if you want to randomise ports to avoid certain kinds of attacks.
The `P2P_ADDR` is the internal address used for communication between peers. Take note of **this address** to include it in the `TRUSTED_PEERS` section of the configuration file.
Lastly, (and not in the example configuration) you have the prometheus endpoint address. It’s set by adding the value `"TELEMETRY_URL": "127.0.0.1:8180"`, to the `TORII` section. It’s not meant to be human-readable, but a `GET` request to `127.0.0.1:8180/status` will give you a JSON-encoded representation of the top-level metrics, while a `GET` request to `127.0.0.1:8180/metrics` will give you a (somewhat verbose) list of all available metrics gathered in Iroha. You might want to change this if you’re having trouble gathering metrics using `prometheus`.

### Logger

This is possibly the easiest to understand. `"MAX_LOG_LEVEL": "WARN"`, changes the logging level to `WARN`. This means that you don’t get any messages, unless they’re either a warning or an error message. The available options are `TRACE` (every time you enter a function), `DEBUG` information that we use when we know something went wrong, `INFO` the default, `WARN` , and `ERROR`, which silences any logging except for error messages.
Another useful option might be to use `"LOG_FILE_PATH": bunyan.json` . What this does is create (if it didn’t exist already) a file called `bunyan.json` that contains the logs in a structured format. This is extremely useful for two reasons: first, you can use the `bunyan` log viewer to filter information more precisely than Iroha would allow you to do. _Only want messages from a specific module or package? You can do that with bunyan_. Second, while copying logs is not too big of a problem if your instance is a small setup, for bigger and longer running processes, the larger the log will be. Having it saved to a file makes much more sense in that case. (**TIP**: you can also set this to `/dev/stdout` if you want to use bunyan’s logging facilities directly, but don’t want to waste space in the filesystem).

## Genesis Block

The genesis block is the first block in your blockchain. It's never empty, even if `configs/peer/genesis.json` is. We recommend adding at least one more account to the genesis block; in our case, it was _alice_@wonderland, which has the public key `ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0` . Think of it as the password used to "log in" as _alice_. _Also note, **Iroha is case-sensitive,** meaning that **Alice@wonderland is different from alice@wonderland.**_ It should go without saying that _alice@wonderland_ is not the same as _alice@looking_glass_ either.

::: details Genesis Block

```json
{
  "transactions": [
    {
      "isi": [
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "Domain": {
                    "name": "wonderland",
                    "accounts": {},
                    "asset_definitions": {},
                    "metadata": {}
                  }
                }
              }
            }
          }
        },
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "NewAccount": {
                    "id": {
                      "name": "alice",
                      "domain_name": "wonderland"
                    },
                    "signatories": [
                      "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"
                    ],
                    "metadata": {}
                  }
                }
              }
            }
          }
        },
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "AssetDefinition": {
                    "id": {
                      "name": "rose",
                      "domain_name": "wonderland"
                    },
                    "value_type": "Quantity",
                    "metadata": {},
                    "mintable": true
                  }
                }
              }
            }
          }
        },
        {
          "Mint": {
            "object": {
              "Raw": {
                "U32": 13
              }
            },
            "destination_id": {
              "Raw": {
                "Id": {
                  "AssetId": {
                    "definition_id": {
                      "name": "rose",
                      "domain_name": "wonderland"
                    },
                    "account_id": {
                      "name": "alice",
                      "domain_name": "wonderland"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  ]
}
```

:::

## Client Configuration

This tutorial will not go in detail about the options you can adjust within the client configuration settings, instead we will provide a broad overview of what is available in Iroha2.
First, the `TORII_API_URL` is the same as `TORII` `API_ADDR` in the peer configuration. You should also add either `http://` or (_preferably_) `https://` to the address. If you are setting up an Iroha peer, you should probably set up a domain for public blockchains, while bare sockets are enough for a local private deployment. The `ACCOUNT_ID` should be self-explanatory: the only thing you need to worry about is that the account must exist in the blockchain. In the example `genesis.json`, you can see how we've set up *alice@*wonderland .

## Keys

Now is a good time to start worrying about Public key cryptography, so we'll give you a primer.
First of all, public and private keys come in pairs. For a given private key it's easy to figure out the corresponding public key, **but the opposite is not true**. It's practically impossible to figure out what the private key corresponding to a given public key is; which is why they're called _public_ and _private_: the former is safe to share without compromising the security of the exchange.
With a private key, you can encrypt information, in a way that only the people who have your public key can read it. By contrast, you cannot encrypt anything with a public key.
When we say signed, we really mean _attached a known piece of data encrypted with the **appropriate** private key_. This known piece of data is usually the hash of the entire message, otherwise people could copy the signature to a different message. When something is _signed_, everyone can read it. Some people: the ones who have your public key, can also tell if the message was written by someone who has your private key. They can't tell if it's _you_, someone who _cracked_ your public key with brute force, or someone who _got_ it from you via social engineering, for example if you leaked your private key in some online conversation.
Cracking someone's key is always possible in theory, but not always practical. For keys shorter than SHA256 it's quite possible that someone _could_ crack your private key. The best solution is to use a longer key. Usually, it makes a tiny file slightly larger, and computations that takes a few microseconds take a few microseconds more. You can barely notice the difference, at the same time it takes exponentially longer to crack. The only reason not to go with the longest possible key is if your hardware can't cope with it.
Protecting against social engineering isn't difficult, as long as you keep your guard up. In essence, all you need to do is to keep your private key _private_. Don't send it to anyone. Don't use cloud services to move it across devices. Don't have malware on your computer. Most importantly, don't use someone else's private key. Consequently, when you're deploying your own network, please make sure to **change the keys**. To get new key-pairs, use the `iroha_crypto_cli` program,

```bash
cargo build -p iroha_crypto_cli
./target/debug/iroha_crypto_cli
```

which will print a fresh key pair on demand.
If you want to set up your own network, you should change the keys for all your peers: in `peer/config.json` change `PUBLIC_KEY` and `PRIVATE_KEY`, to the fresh pair. When you've done that, you should add the keys to the `TRUSTED_PEERS` array in the same configuration file.
**EXAMPLE:** in the minimum viable BFT network, you have four peers, so that means that you need to create _four_ different peer configuration files (`config.json`). Each peer should have its own `PUBLIC_KEY` and `PRIVATE_KEY` , all four public keys should be added to the `TRUSTED_PEERS` array (_yes including the peer that you're configuring_), and the same `TRUSTED_PEERS` array must be copied across all four configuration files.
Next, you must make sure that the peers agree on the `GENESIS_ACCOUNT` key pairs.

::: tip

Don't worry about the fact that the genesis account's private key is known to all peers, the genesis account loses all privileges after the first block gets committed.

:::

Finally, while the first client _could_ use the genesis account to register new users, it's not a great idea for private networks. You should instead register a non-genesis account (for example *alice@*wonderland), and `unregister` the genesis account.

::: warning NB

`iroha_client_cli` doesn't currently support unregister instructions. If you plan on creating a private blockchain, you should consider writing your own client based on the `client` Rust crate, or any of the provided client libraries.

:::

Here are the links to the [iroha-python](https://github.com/hyperledger/iroha-python), [iroha-iOS](https://github.com/hyperledger/iroha-ios), [iroha-java](https://github.com/hyperledger/iroha-java) and [iroha-javascript](https://github.com/hyperledger/iroha-javascript) libraries.

Finally, let's talk about how keys are used in the client. Every transaction is signed on behalf of some user, thus every operation requires a key. That doesn't mean that you need to explicitly provide a key every time. For example, you need to have a user to register another user (_just like you need scissors to open a bag with new scissors_). But in order to register a user, you must also provide a new public key so that the network can verify that it's that trustworthy *mad_hatter@*wonderland, and not some impostor (_possibly sent by the red_queen),_ so there are cases where you need to provide a key explicitly.

Each time `iroha_client_cli` asks you to provide a `--key` argument, it's probably a good idea to generate a new key-pair.

## Running Iroha on bare metal

### Pre-requisites

Having read most of the appendix, you are now prepared to start Iroha in a more advanced mode. What we are going to do is replicate the set up that we have in `docker compose`, except we won't go through the intermediary of containers, instead, we'll run Iroha directly.
Running iroha on bare metal involves manipulating files and/or environment variables. What follows is an attempt to run Iroha on bare metal, using either of two methods. We shall first focus on the file-based approach, as it is the easiest to get right. We shall then show you how to do the same using environment variables, which can offer a better user experience if done right, but is more error-prone, particularly for exotic systems.
First of all, we should note that we have only built the Iroha client so far. To build the peer software you should run

```kotlin
cargo build -p iroha
```

This will build Iroha in `debug` mode, containing many more debug-oriented features and very few (if any) compiler optimisations. A debug build is faster to compile, but if you intend to actually deploy Iroha, you should build it in `--release` mode like so

```kotlin
cargo build -p iroha --release
```

This will take significantly longer, but should produce a smaller and faster binary, suitable for deployment in the actual blockchains.

### Environment variables: set-up

Next, we want to make sure that we have the right configuration. To do that, it’s a good idea to either copy the contents of the `~/Git/iroha/configs/peer/` into a new directory, or alternatively, run all commands from that directory: `cd ~/Git/iroha/configs/peer`. A third option is to specify the full path to the configuration in an environment variable. For simplicity we shall do the latter:

```bash
cd ~
export IROHA2_GENESIS_PATH="$(pwd)/Git/iroha/configs/peer/genesis.json"
export IROHA2_CONFIG_PATH="$(pwd)/Git/iroha/configs/peer/config.json"
```

For additional convenience, you could add the Iroha 2 `target` directory to your `PATH`. This means that instead of having to specify the full path to the executable `iroha` you can instead type `iroha` directly into your command line.
::: tip

Don’t forget to replace `debug` with `release` when you’re ready to deploy in the real world.

:::

```bash
export PATH="$PATH:$(pwd)/Git/iroha/target/debug"
```

This way you can run `iroha` from any directory, without having to worry about configuration paths and/or specifying the full path to the Iroha executable.

The instructions here should probably be made permanent, which you can do by adding the following environment variables to your startup shell. On older Linux systems, you copy and paste everything except `cd ~` to `~/.bashrc`. On macs running Mac OS X 10.6 and later, as well as some Linux systems, you want to add the same lines to `~/.zshrc`.

::: tip

This process is almost universally unreliable and messy, and it’s likely that your system is special in that it breaks some of our assumptions. If the above optional steps didn’t work for you, you can keep working in the `~/Git/iroha/configs/peer/` folder, and run iroha using `~/Git/iroha/target/debug/iroha`. This makes the command-line a little harder to read, which is why we recommend setting up your environment first.

:::

::: info Note

The tutorial assumes that you’re running either Linux, Mac OS X, or Windows using WSL. It should be possible to run directly on Windows, but that is neither recommended nor easy. If you don’t want to use a Unix-like system, we suggest that you wait until we publish a detailed guide for Windows users.

:::

### Files: set-up

This is the recommended method of bringing up an Iroha peer. What we do is create a new directory for the configuration files,

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

You could also use the iroha peer binary locally, by copying it into the same folder. The only difference would be that you’d be calling Iroha: `./iroha` instead of `iroha`.

:::

### First run of Iroha on bare metal

If you’ve done everything correctly, you can now input

```bash
iroha
```

to start your first peer and be greeted with

<!-- FIXME untitled -->

![Untitled](/img/appendix_running-iroha_cli-output.png)

This means that everything is working, but also that we need to do some more work.
You have just started a single peer, which can tolerate exactly 0 faults. Running two peers is also possible, but again, can tolerate 0 faults. You must run at least 4 peers in order to have the capacity to tolerate at least one fault. In general, if you want to be resistant to `f` faults, you want to have `3f+1` peers: (4, 7, 10 etc.).
However, you cannot start a peer any way you want. When we started our original peer, we specified in its configuration that it has to trust very specific peers, which have a particular private key, and listen on a specific address. In order to know how to run them appropriately, take a look at `docker-compose.yml`.

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
      IROHA_PRIVATE_KEY: '{"digest_function": "ed25519", "payload": "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}'
      SUMERAGI_TRUSTED_PEERS: '[{"address":"iroha0:1337", "public_key": "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}, {"address":"iroha1:1338", "public_key": "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}, {"address": "iroha2:1339", "public_key": "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}, {"address": "iroha3:1340", "public_key": "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
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
      IROHA_PRIVATE_KEY: '{"digest_function": "ed25519", "payload": "3bac34cda9e3763fa069c1198312d1ec73b53023b8180c822ac355435edc4a24cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}'
      SUMERAGI_TRUSTED_PEERS: '[{"address":"iroha0:1337", "public_key": "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}, {"address":"iroha1:1338", "public_key": "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}, {"address": "iroha2:1339", "public_key": "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}, {"address": "iroha3:1340", "public_key": "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
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
      IROHA_PRIVATE_KEY: '{"digest_function": "ed25519", "payload": "1261a436d36779223d7d6cf20e8b644510e488e6a50bafd77a7485264d27197dfaca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}'
      SUMERAGI_TRUSTED_PEERS: '[{"address":"iroha0:1337", "public_key": "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}, {"address":"iroha1:1338", "public_key": "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}, {"address": "iroha2:1339", "public_key": "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}, {"address": "iroha3:1340", "public_key": "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
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
      IROHA_PRIVATE_KEY: '{"digest_function": "ed25519", "payload": "a70dab95c7482eb9f159111b65947e482108cfe67df877bd8d3b9441a781c7c98e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}'
      SUMERAGI_TRUSTED_PEERS: '[{"address":"iroha0:1337", "public_key": "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}, {"address":"iroha1:1338", "public_key": "ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1"}, {"address": "iroha2:1339", "public_key": "ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020"}, {"address": "iroha3:1340", "public_key": "ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f"}]'
    ports:
      - '1340:1340'
      - '8083:8083'
      - '8183:8183'
```

:::

For every peer, the `environment` section is the set of things that you should put in front of the `iroha` command, replacing colons with equals signs. All the socket addresses are also given internal to the docker network, so we should replace them with `[localhost](http://localhost)` which is `127.0.0.1` on most machines.

::: tip

Each Iroha instance is going to listen to three ports: the Peer-to-peer communications channel (`133X`), the API url, where most client requests are posted (`808X`), and finally, a telemetry endpoint `818X`. All three ports need to be adjusted so there are no collisions. See the `docker-compose.yml` for an example, and adjust as needed.

:::

### Environment Variables: deploy a minimal BFT network

To run the First peer, we need to input

```bash
TORII_P2P_ADDR="127.0.0.1:1337"
TORII_API_URL="127.0.0.1:8080"
TORII_STATUS_URL="127.0.0.1:8180"
IROHA_PUBLIC_KEY="ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0" IROHA_PRIVATE_KEY='{"digest_function": "ed25519", "payload": "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"}'
iroha --submit
```

and three other similar lines of bash for the remaining deployments.

::: tip

To copy and paste into the terminal on Linux systems, you should remember that `Control + **shift** + V` is the appropriate `paste` shortcut.

:::

Also note that we asked this peer to `--submit` or `--submit-genesis`. This means that in the initial network topology, this peer is the leader. At least one peer (usually the first) needs to be the leader in the initial topology.

Now you should do the same for the other four peers. Be mindful not to mix up which address goes where, replace `irohaX` with `127.0.0.1` in the addresses, and make sure that they correspond to the right public key.

This is a messy and error-prone process, which is why the tutorial uses `docker-compose`. However, this brings you closer to the experience of actually maintaining a functional Iroha peer.

### Files: deploy a minimal BFT network

Our first peer can run off of the original configuration file. What we should do is create three more similar files and move them to three different folders e.g. `peer1`, `peer2`. What you need to do is change the `TORII:P2P_ADDR`, `TORII:API_URL` `TORII:STATUS_URL` , and the `PUBLIC_KEY` configuration options to align with their `docker-compose.yml` counterparts. Then in each of the new folders (`peer1`, `peer2` etc.) run:

```bash
iroha
```

except for one. In the first folder `peer0` you should instead run

```bash
iroha --submit-genesis
```

We effectively asked this peer to `--submit` or `--submit-genesis` in the initial or _bootstrap_ network. This means that in the initial network topology, this peer is the leader.

::: info Note

Only the leader of the genesis network needs to have access to `genesis.json`. Having the same genesis in the initial folders of the other peers could be useful, since future versions of `iroha` will also sanity-check the genesis blocks.

Now you should do the same for the other four peers. Be mindful not to mix up which address goes where, replace `irohaX` with `127.0.0.1` in the addresses, and make sure that they correspond to the right public key.

This is a messy and error-prone process, which is why the tutorial uses `docker-compose`. However, this brings you closer to the experience of actually maintaining a functional Iroha peer.

If all went well, you should be greeted with nice logs on each of the nodes, and the nodes should commit the blocks to the `blocks/` directory.

### Real-world deployment

Suppose now, that you have done all of the tinkering and want to deploy Iroha in the real world. First of all, you should build it in release mode:

```bash
cargo build --release
```

Second, you want to generate a key pair for your peer:

```bash
cargo run --bin iroha_crypto_cli
```

And take note of that key. Third, you should register your peer to a network, and make sure to add at least four of the peers on that network to the `TRUSTED_PEERS` array in your configuration file. You can then determine the web socket that the other peers will use to connect to you. Make sure that the port is open and use the Address in your `config.json`. Finally, after you are done editing the configuration file, deploy iroha by running

```bash
~/Git/iroha/target/release/iroha
```

::: info Note
There’s no need to pass the `--submit` flag, unless you are starting the initial peer on the network.
:::
