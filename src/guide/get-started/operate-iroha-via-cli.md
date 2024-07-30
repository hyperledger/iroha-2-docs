# Operate Iroha via CLI

In this tutorial, we will set up and configure the Iroha client CLI, and perform some basic actions on the Iroha blockchain with it.

You can learn how to:
  - register [domains](#_3-register-a-domain) and [accounts](#_4-register-an-account)
  - [mint](#_6-register-and-mint-assets), [transfer](#_7-transfer-assets) and [burn](#_8-burn-assets) assets
  - [visualize outputs](#_9-visualize-outputs)

## 1. Setup Iroha 2 Client

Note, first, that we have already created the necessary binary executables when we [ran the `build` command](./install-iroha.md#build-iroha-2-client).

Create a fresh directory for the client and copy the configuration file there:

```bash
$ cp path_to_repo/defaults/client.toml path_to_created_directory/
```

Then copy the necessary binaries into the client directory:

```bash
$ cp path_to_repo/target/release/iroha path_to_repo/target/release/kagami path_to_created_directory/
```

Ensure you [brought up the test network](./launch-iroha.md). You can monitor blockchain events in the terminal where it runs.

## 2. Configure Iroha 2 Client

Navigate to the binaries directory in your terminal. Check that it contains `iroha`, `kagami` and `client.toml`.

Run the client CLI:

```bash
$ ./iroha
```

::: details Expand to see the expected output

```bash
Iroha CLI Client lets you interact with Iroha Peers Web API without direct network usage

Usage: iroha [OPTIONS] <COMMAND>

Commands:
  domain   The subcommand related to domains
  account  The subcommand related to accounts
  asset    The subcommand related to assets
  peer     The subcommand related to p2p networking
  events   The subcommand related to event streaming
  wasm     The subcommand related to Wasm
  blocks   The subcommand related to block streaming
  json     The subcommand related to multi-instructions as Json or Json5
  help     Print this message or the help of the given subcommand(s)

Options:
  -c, --config <PATH>  Path to the configuration file [default: client.toml]
  -v, --verbose        More verbose output
  -h, --help           Print help
  -V, --version        Print version

```

:::

By default, the Iroha client searches for its configuration in the `client.toml` file located in the current working directory. We already copied it there, so we're all set.

::: tip

To run any of the Iroha client commands with some other configuration file, use the following syntax:

```bash
$ ./iroha --config path/to/client.toml <COMMAND>
```

This is not _persistent configuration_: each time you run `iroha`, you must add the `--config path/to/client.toml` command-line argument, unless you put the `client.toml` config file in the same directory as `iroha` binary.

:::

The account specified in the `[account]` section of `client.toml` is preregistered in the blockchain. Only it can interact with the blockchain for now. If you change the keys or the domain of the account in the config file, you should ensure they are preregistered in the blockchain too.

To check that configuration works, try to run a query, e.g.:

```bash
$ ./iroha domain list all
```

The output should contain several preregistered domains.

## 3. Register a Domain

To get started, you must first register a domain:

```bash
$ ./iroha domain register --id="looking_glass"
```

A _domain_ is a group of entities like asset definitions, accounts, and other objects grouped logically. We'll talk about it in more detail in other documentation sections.

You will receive a confirmation message. However, the new domain details will not be directly readable in that message. To confirm that you created the new _looking_glass_ domain successfully, run:

```bash
$ ./iroha domain list all
```

The output should contain the _looking_glass_ domain:

```json
  {
    "id": "looking_glass",
    "logo": null,
    "metadata": {},
    "owned_by": "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland"
  },
```

Note, the owner of the new domain is the account specified in our config file. They performed the registration.

With a domain available, it is time to register an account in it.

## 4. Register an Account

To register a new account, you need a cryptographic key pair consisting of a _public_ and a _private_ key. You will use it to establish a secure communication channel between yourself and the network.

For users' convenience, Iroha 2 comes with `kagami`, an in-built key generator tool. To generate a new key pair with `kagami`, run the following command:

```bash
$ ./kagami crypto
```

::: tip

To customize the generated keys, you can specify a number of parameters. For instance, `kagami` can use one of four available algorithms to generate cryptographic keys.

To learn more about generating cryptographic keys with `kagami`, available algorithms, and other parameters, see [Generating Cryptographic Keys with Kagami](/guide/security/generating-cryptographic-keys.md#kagami)

:::

For the purposes of this tutorial, we will use the following key pair:

```bash
Public key (multihash): "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379"
Private key (multihash): "802620CBD3D701B561FE98463767729176404DC757D690F78980B8FDD40C171CCB8EB5"
```

To register a new account within the _looking_glass_ domain, run:

```bash
$ ./iroha account register --id="ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"
```

The `--id` argument in the above code snippet specifies the _account id_, the unique identifier of the account. It consists of the user public key (generated using `kagami`) and the domain it is associated with.

If the account registration succeeds, you will receive a confirmation message. Like before, you should query the accounts to verify the details.

```bash
$ ./iroha account list all
```

::: details Expand to see the expected output

```json
[
  {
    "id": "ed0120E9F632D3034BAB6BB26D92AC8FD93EF878D9C5E69E01B61B4C47101884EE2F99@garden_of_live_flowers",
    "metadata": {}
  },
  {
    "id": "ed01204164BF554923ECE1FD412D241036D863A6AE430476C898248B8237D77534CFC4@genesis",
    "metadata": {}
  },
  {
    "id": "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass",
    "metadata": {}
  },
  {
    "id": "ed012004FF5B81046DDCCF19E2E451C45DFB6F53759D4EB30FA2EFA807284D1CC33016@wonderland",
    "metadata": {
      "key": "value"
    }
  },
  {
    "id": "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland",
    "metadata": {
      "key": "value"
    }
  }
]
```
:::

## 5. Transfer a Domain

We could change the keys and domain in `client.toml` at this point and continue working with the account we just created, but we wouldn't be able to do much in the _looking_glass_ domain, as our new account is not the owner of _looking_glass_, and cannot manage it.

Let's transfer the _looking_glass_ domain to the account we created:

1. Run the transfer command:

  ```bash
  $ ./iroha domain transfer --id="looking_glass" --from "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland" --to "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"
  ```
2. Check that the ownership changed:

  ```bash
  $ ./iroha domain list all
  ```

3. Switch to the newly created account. For this, we need to modify the `public_key`, `private_key`, and `domain` in the `client.toml` config file with the ones we registered earlier.

  The `account` section of your updated `client.toml` should look like this:

  ```toml
  [account]
  domain = "looking_glass"
  public_key = "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379"
  private_key = "802620CBD3D701B561FE98463767729176404DC757D690F78980B8FDD40C171CCB8EB5"
  ```

::: tip
[Permissions](/guide/blockchain/permissions) determine accounts rights within Iroha. Domain owners have the most rights in a domain by default, but permission configuration in Iroha is very flexible and can be customized to your needs.
:::

Now that we control the domain, we can mint assets in it.


## 6. Register and Mint Assets

In order to mint assets, you need to register the [asset definition](/guide/blockchain/assets) first. We are going to register the _tea_ token within the _looking_glass_ network. To do that, run:

```bash
$ ./iroha asset definition register --id="tea#looking_glass" --type="Numeric"
```

The Numeric _tea_ asset is now registered within the _looking_glass_ domain.

If you open the terminal where the Iroha network runs, you will see that all our activity caused numerous pipeline events there.

To mint _tea_ tokens run:

```bash
$ ./iroha asset mint --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass" --quantity="100"
```

After minting one hundred _tea_, you will see more pipeline events in the logger, and you can also query the assets that you have just minted:

```bash
$ ./iroha asset list all
```

::: details Expand to see the expected output

```json
[
  {
    "id": "tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass",
    "value": {
      "Numeric": "100"
    }
  },
  {
    "id": "cabbage#garden_of_live_flowers#ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland",
    "value": {
      "Numeric": "44"
    }
  },
  {
    "id": "rose##ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland",
    "value": {
      "Numeric": "13"
    }
  }
]
```
:::


## 7. Transfer Assets

After minting the assets, you can transfer some of your tea to another account:

```bash
$ ./iroha asset transfer --to="ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland" --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"  --quantity=33
```

## 8. Burn Assets

Burning assets is quite similar to minting them:

```bash
$ ./iroha asset burn --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass" --quantity="15"

```

## 9. Visualize Outputs

Although you will get a constant data feed of the network within the terminal running `docker compose`, you can also configure an output to listen
to events of several types on the network: blocks generation, transactions, data events and triggers.

We will set up an event listener for the block pipeline.

From a new terminal tab/window run:

```bash
$ ./iroha events block-pipeline
```

The output would look like this:

```json
Listening to events with filter: Pipeline(Block(BlockEventFilter { height: None, status: None }))
{
  "Pipeline": {
    "Block": {
      "header": {
        "height": 14,
        "prev_block_hash": "AF1ABC889019971D4C4E8866C347367D63A024319E50AEF989DB255F761E9D1D",
        "transactions_hash": "7F2091D887BF9DBF6100DFEA696B06AE269C288AE55F1D281D9FDDAD93D1B8F1",
        "creation_time_ms": 1721132667162,
        "view_change_index": 1,
        "consensus_estimation_ms": 4000
      },
      "hash": "1CC6256356418D02F19B17487AD4F7F105AE6CD3FD129760C575066484F3EF97",
      "status": "Approved"
    }
  }
}
{
  "Pipeline": {
    "Block": {
      "header": {
        "height": 14,
        "prev_block_hash": "AF1ABC889019971D4C4E8866C347367D63A024319E50AEF989DB255F761E9D1D",
        "transactions_hash": "7F2091D887BF9DBF6100DFEA696B06AE269C288AE55F1D281D9FDDAD93D1B8F1",
        "creation_time_ms": 1721132667162,
        "view_change_index": 1,
        "consensus_estimation_ms": 4000
      },
      "hash": "99D30F9DD159A397A76E4A37143433BD302264F7509B6E154CA9C18263543857",
      "status": "Committed"
    }
  }
}
{
  "Pipeline": {
    "Block": {
      "header": {
        "height": 14,
        "prev_block_hash": "AF1ABC889019971D4C4E8866C347367D63A024319E50AEF989DB255F761E9D1D",
        "transactions_hash": "7F2091D887BF9DBF6100DFEA696B06AE269C288AE55F1D281D9FDDAD93D1B8F1",
        "creation_time_ms": 1721132667162,
        "view_change_index": 1,
        "consensus_estimation_ms": 4000
      },
      "hash": "99D30F9DD159A397A76E4A37143433BD302264F7509B6E154CA9C18263543857",
      "status": "Applied"
    }
  }
}

```

Run the help command `./iroha events help` to find out how to listen to other types of events.

## What's Next

Now that you know the basics, you can proceed to one of our language-specific [turorials](/guide/get-started/tutorials) to learn how to build on Iroha.