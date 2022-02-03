# 2. Configuring Iroha 2 (Bash)

Now let's look at how to properly configure Iroha 2, and especially its **C**ommand-**L**ine **I**nterface client.

Make sure that you have another terminal tab/window with a running version, using the instructions above. You can use this screen to monitor the pipeline events as they are output.

On a new terminal tab run

```bash
cd ~/Git/iroha/test_docker
```

If you folowed the steps correctly, this should contain the `iroha_client_cli` and `config.json`, (`ls` to make sure, and if not, see previous section).

Run

```bash
./iroha_client_cli
```

And you will get the following message:

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

To configure the Iroha client, run

```bash
./iroha_client_cli --config ./test_docker/config.json
```

It should be noted that this is not _persistent configuration:_ each time you run `iroha_client_cli` you must add the `--config ./test_docker/config.json`command-line argument.

::: tip

Because the client looks in its working directory for a file called `config.json` it's always much easier to just copy (or link) the file into the working directory. Alternatively, you could also create a shell alias.

:::

Feel free to edit the file and see what each option does. The only thing that you shouldn't edit at this point is the account. You see, `alice` has to be pre-registered in the genesis block. Only she can interact with the blockchain, and if you change the value of the user account, you should also make sure that that user exists in the blockchain.

To make sure that your configuration options worked, try to run a query, e.g.:

```bash
./iroha_client_cli domain list all
```

If the output looks like some form of `JSON` (but not quite), then the configuration was succesful!
