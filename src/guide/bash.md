# Bash Guide

## 0. A brief primer on CLI applications

This is as good a place as any to discuss what `iroha_client_cli` is and
what you should expect it to be able to do.

Most users think that everything that's run inside the terminal is a CLI
program. This is not the case. A **Command-line Interface** is a glorified
scripting language that you interact with using the shell.

CLI programs are run multiple times and given different _arguments_:
`--flag1` `file2` `--help`, etc., depending on what you want to do. A
single session doesn't begin with you opening the program and end with you
closing it. When you've stopped interacting, the `iroha_client_cli` session
is finished.

You also don't _configure_ a CLI program in the usual sense of the word.
Most people expect that it's possible to change some settings of a program
from inside that same program, but most CLI programs are configured
differently.

First of all, if you want to make a certain `--flag` part of the way you
invoke `iroha_client_cli`, you should create a
[shell alias](https://www.educba.com/bash-alias/). Some programs, but not
`iroha_client_cli`, also use something called
[Environment variables](https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa).

Finally, most programs store persistent information that is too big for
either a shell alias or an environment variable in a separate file.
`iroha_client_cli` does not yet follow the
[XDG_CONFIG_HOME specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html).
It only looks for a configuration file in one of two places:

1. If the `-c` or `--config` command line flag is specified, the next
   argument interpreted as a path.

   For example: `-c ~/Git/iroha/configs/peer/config.json`. If that file
   doesn't exist, you will see an error, and `iroha_client_cli` won't look
   for a configuration file anywhere else.

2. If neither `-c` nor `--config` were given, it will look in the current
   working directory.

These defaults are not very ergonomic. They are artifacts of the way in
which Iroha is being deployed, and the fact that a CLI interface is used
exclusively for testing purposes.

::: info

This might change in the future, but likely not by fixing
`iroha_client_cli` but rather by replacing it entirely with Iroha Python.
The only thing stopping us from that today is that Iroha Python has not
gotten the attention it deserves.

:::

It is possible that a user might be expecting `iroha_client_cli` to behave
like a graphical program using terminal graphics: a **Terminal User
Interface**. While we'd like to provide you with such a program, we don't
think that it offers enough convenience over the amount of effort that we'd
need to put in.

::: info

It is possible that in the future, once `iroha_client_cli` is phased out
and `iroha_python` is the official scripting interface, we might use the
excellent Python libraries for creating a useful TUI. For now, one must
make do with what one has.

:::

## 1. Iroha 2 Client Setup

Note, first, that we have already created the `iroha_client_cli` binary
executable, when we ran the build command.

Create a fresh directory for the client:

```bash
mkdir -p test_docker
```

Copy the configuration file to the client directory:

```bash
cp ./configs/client_cli/config.json test_docker/
```

::: tip

You could also use a file manager (e.g. finder) to do that. We prefer
providing command-line instructions, because they are easier to follow
step-by-step.

:::

To test Iroha 2 metadata capabilities, let's also create a dummy
`metadata.json` file:

```bash
echo '{"comment":{"String": "Hello Meta!"}}' > test_docker/metadata.json
```

To get the CLI started, copy the `iroha_client_cli` binary into the client
directory:

```bash
cp ./target/debug/iroha_client_cli test_docker/
```

Make sure you bring up the test network as well.

## 2. Configuring Iroha 2

Now let's look at how to properly configure Iroha 2, and especially its
**C**ommand-**L**ine **I**nterface client.

Make sure that you have another terminal tab or window open with a running
version, using the instructions above. You can use this screen to monitor
the pipeline events as they are output.

On a new terminal tab run:

```bash
cd ~/Git/iroha/test_docker
```

If you followed the steps correctly, this should contain the
`iroha_client_cli` and `config.json`.

::: tip

Use `ls` to make sure both files are there, and if not,
[return to Step 1](#_1-iroha-2-client-setup).

:::

Run

```bash
./iroha_client_cli
```

::: details Expand to see the expected output

```
iroha_client_cli 0.1.0
Soramitsu Iroha2 team (https, //github.com/orgs/soramitsu/teams/iroha2)
Iroha CLI Client provides an ability to interact with Iroha Peers Web API without direct network usage

USAGE:
    iroha_client_cli [OPTIONS] <SUBCOMMAND>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
    -c, --config <config>    Sets a config file path [default: config.json]

SUBCOMMANDS:
    account    The subcommand related to accounts
    asset      The subcommand related to assets
    domain     The subcommand related to domains
    events     The subcommand related to event streaming
    help       Prints this message or the help of the given subcommand(s)
    peer       The subcommand related to p2p networking
```

:::

To configure the Iroha client, run:

```bash
./iroha_client_cli --config ./test_docker/config.json
```

It should be noted that this is not _persistent configuration_: each time
you run `iroha_client_cli`, you must add the
`--config ./test_docker/config.json` command-line argument.

::: tip

Because the client checks the working directory for a file called
`config.json`, it's always much easier to just copy (or link) the file into
the working directory. Alternatively, you could also create a shell alias.

:::

Feel free to edit the file and see what each option does. The only thing
that you shouldn't edit at this point is the account. You see, `alice` has
to be pre-registered in the genesis block. Only she can interact with the
blockchain, and if you change the value of the user account, you should
also make sure that that user exists in the blockchain.

To make sure that your configuration options worked, try to run a query,
e.g.:

```bash
./iroha_client_cli domain list all
```

If the output looks like some form of JSON (but not quite), then the
configuration was successful!

## 3. Registering a Domain

To get started, you must register a domain:

```bash
./iroha_client_cli domain register --id="looking_glass"
```

You will receive a confirmation of the domain creation. However, this
information will not be clearly visible within the message. To confirm that
the new domain _looking_glass_ has been created successfully, run:

```bash
./iroha_client_cli domain list all
```

The printout should contain the recently-created _looking_glass_ domain

```rust
Domain {
    name: "looking_glass",
    accounts: {},
    asset_definitions: {},
    metadata: Metadata {
        map: {},
    },
},
```

With a domain available, it is time to register an account.

## 4. Registering an Account

To register a new account within the _looking_glass_ domain, run:

```bash
./iroha_client_cli account register \
    --id="mad_hatter@looking_glass" \
    --key="ed0120a753146e75b910ae5e2994dc8adea9e7d87e5d53024cfa310ce992f17106f92c"
```

If the account registration is successful, you will receive a confirmation
message. Like before, it is necessary to query the accounts to verify that
_mad_hatter_ has been registered.

To see all the accounts on the network, run:

```bash
./iroha_client_cli account list all
```

This will list the active accounts on the network, along with their assets.
It will look like this:

```rust
Account {
    id: Id {
        name: "mad_hatter",
        domain_name: "looking_glass",
    },
    assets: {},
    signatories: [
    PublicKey {
        digest_function: "ed25519",
        payload: "A753146E75B910AE5E2994DC8ADEA9E7D87E5D53024CFA310CE992F17106F92C",
    },
}
```

Another way to create a user (and the user's keys) is as follows:

1. Open a new tab and navigate to the `/iroha` directory, then run:

   ```bash
   ./target/debug/iroha_crypto_cli
   ```

2. Copy the public key and repeat the instructions to register a new
   account. Every time you run this command, you will generate a new
   key-pair.

In this case, we will create an account for _white_rabbit_ within the
_looking_glass_ domain, so we will run:

```bash
./iroha_client_cli account register \
    --id="white_rabbit@looking_glass" \
    --key="ed0120a4c4dadd9f18b0f63d6a420151fe0748d785475dec63034a15fcf999ceda1e65"
```

And like before, the new active user will be listed on the network:

```rust
Account {
        id: Id {
            name: "white_rabbit",
            domain_name: "looking_glass",
        },
        assets: {},
        signatories: [
            PublicKey {
                digest_function: "ed25519",
                payload: "A4C4DADD9F18B0F63D6A420151FE0748D785475DEC63034A15FCF999CEDA1E65",
            },
        ]
}
```

Now that the network and users are registered, it is possible to mint
assets.

## 5. Registering and minting assets

In order to mint assets, you need to register the asset first. We are going
to register the _tea_ token within the _looking_glass_ network. To do that,
run:

```bash
./iroha_client_cli asset register \
    --id="tea#looking_glass" \
    --value-type=Quantity
```

The _tea_ asset is now registered within the _looking_glass_ network. The
output within the CLI is the same as with other commands, you will be able
to see that there are new events in the pipeline.

With the asset created, you can now mint tokens. Run:

```bash
./iroha_client_cli asset mint \
    --account="mad_hatter@looking_glass" \
    --asset="tea#looking_glass" \
    --quantity="100"
```

After minting one hundred _tea_, you will see more pipeline events in the
logger, and you can also query the assets that you have just minted:

```bash
./iroha_client_cli asset list all
```

After running this command, you will be able to see the tokens currently
available on the network:

```rust
[
    Asset {
        id: Id {
            definition_id: DefinitionId {
                name: "tea",
                domain_name: "looking_glass",
            },
            account_id: Id {
                name: "mad_hatter",
                domain_name: "looking_glass",
            },
        },
        value: Quantity(
            100,
        ),
    },
    Asset {
        id: Id {
            definition_id: DefinitionId {
                name: "rose",
                domain_name: "wonderland",
            },
            account_id: Id {
                name: "alice",
                domain_name: "wonderland",
            },
        },
        value: Quantity(
            13,
        ),
    },
]
```

Iroha 2 currently doesn't validate the account names, so you could (in
theory) add invalid characters to the name, e.g. spaces. **We recommend
sticking to English alphanumeric characters and underscores**.

## 6. Visualizing outputs

Although you will get a constant data feed of the network within the
terminal running docker compose, you can also configure an output to listen
to events on the network.

From a terminal tab/window run:

```bash
./iroha_client_cli events pipeline
```

This view will output all the events related to Iroha 2, such as
transactions, block validations, or data events (e.g. when the in-memory
representation of the blockchain gets committed to the hard disk).

The output would look like this:

```rust
Iroha Client CLI: build v0.0.1 [release]
User: alice@wonderland
{"PUBLIC_KEY":"ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0","PRIVATE_KEY":{"digest_function":"ed25519","payload":"9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},"ACCOUNT_ID":{"name":"alice","domain_name":"wonderland"},"TORII_API_URL":"http://127.0.0.1:8080","TORII_STATUS_URL":"127.0.0.1:8180","TRANSACTION_TIME_TO_LIVE_MS":100000,"TRANSACTION_STATUS_TIMEOUT_MS":10000,"MAX_INSTRUCTION_NUMBER":4096,"ADD_TRANSACTION_NONCE":false,"LOGGER_CONFIGURATION":{"MAX_LOG_LEVEL":"INFO","TELEMETRY_CAPACITY":1000,"COMPACT_MODE":false,"LOG_FILE_PATH":null}}
Listening to events with filter: Pipeline(EventFilter { entity: None, hash: None })
Pipeline(
    Event {
        entity_type: Transaction,
        status: Validating,
        hash: 10fadf7b7fb8036d00bbd8cadc5358193b04ad6573537463acef2091ba4d0e77,
    },
)
Pipeline(
    Event {
        entity_type: Block,
        status: Validating,
        hash: 944269f27e1ed8882c6c8c74bd641bc3551ef5651320f4e1e1be11a470b4e3c3,
    },
)
Pipeline(
    Event {
        entity_type: Transaction,
        status: Committed,
        hash: 10fadf7b7fb8036d00bbd8cadc5358193b04ad6573537463acef2091ba4d0e77,
    },
)
```
