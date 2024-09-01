# Operate Iroha via CLI

Most of the operations with an Iroha network can be performed via the Iroha Client CLI. This tutorial aims to help you set it up and configure, and then perform some of the basic operations with the network.

For quick access to an operation that interests you, use the **On this page** menu.

## 1. Set Up Iroha Client CLI

::: info

To set up the Iroha Client CLI, an instance of the Iroha network must be [launched and operational](./launch-iroha.md).

:::

Create a new directory and copy the `client.toml` configuration file there:

```bash
$ cp path_to_iroha_repo/defaults/client.toml path_to_new_directory/
```

## 2. Configure Iroha Client CLI

1. Navigate to the directory with the copied `client.toml` configuration file.

2. Run the Iroha Client CLI:

   ```bash
   $ iroha
   ```

   ::: details Expected output

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

By default, the Iroha Client searches for a configuration in the `client.toml` file located in its current working directory. We already copied it there, so we're all set.

::: tip

To run any of the Iroha client commands with some other configuration file, use the following syntax:

```bash
$ iroha --config path/to/client.toml <COMMAND>
```

This is a _non-persistent configuration_: each time you run `iroha`, you must add the `--config path/to/client.toml` command-line argument, unless the `client.toml` config file is in the working directory.

:::

The account specified in the `[account]` section of `client.toml` is preregistered in the default [genesis block](/guide/configure/genesis) of the blockchain. Only it can interact with the blockchain for now. If you change the keys or the domain of the account in the configuration file, make sure that they are preregistered on the blockchain too.

To check that a configuration works, run the following query:

```bash
$ iroha domain list all
```

The output should contain several preregistered domains.

<!-- TODO: if possible, consider adding the `expected result` similar to step 2 -->

## 3. Register a Domain

::: info

A _domain_ is a group of entities like asset definitions, accounts, and other objects grouped logically. These are described in greater detail in the [Blockchain](TODO) section of the documentation.

:::

To register a new domain, run:

```bash
$ iroha domain register --id="looking_glass"
```

Once executed, a confirmation message appears. However, since the details of the new domain are not directly readable in that message, to confirm that you have successfully created the new `looking_glass` domain, run:

```bash
$ iroha domain list all
```

::: details Expected output

```json
  {
    "id": "looking_glass",
    "logo": null,
    "metadata": {},
    "owned_by": "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland"
  },
```

Note that the owner of the new domain is the account specified in our config file. They performed the registration.

:::

With a domain available, it is time to register an account in it.

## 4. Register an Account

To register a new account, you need a cryptographic key pair consisting of a _public_ and a _private_ key. You will use it to establish a secure communication channel between yourself and the network.

For users' convenience, Iroha comes with `kagami`, a built-in key generator tool. To generate a new key pair with `kagami`, run the following command:

```bash
$ kagami crypto
```

::: tip

To customize the generated keys, you can specify a number of parameters. For instance, `kagami` can use one of four available algorithms to generate cryptographic keys.

To learn more about generating cryptographic keys with `kagami`, available algorithms, and other parameters, see [Generating Cryptographic Keys with Kagami](/guide/security/generating-cryptographic-keys.md#kagami)

:::

For the purposes of this tutorial, we iuse the following key pair:

```bash
Public key (multihash): "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379"
Private key (multihash): "802620CBD3D701B561FE98463767729176404DC757D690F78980B8FDD40C171CCB8EB5"
```

To register a new account within the `looking_glass` domain, run:

```bash
$ iroha account register --id="ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"
```

The `--id` argument in the above code snippet specifies the _account id_, the unique identifier of the account. It consists of the user public key (generated using `kagami`) and the domain it is associated with.

If the account registration is successful, you receive a confirmation message. Similar to the domain registration, to confirm that you have successfully created a new account within the `looking_glass` domain, run:

```bash
$ iroha account list all
```

::: details Expected result

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

<!-- TODO: since in the last tutorial, we created an account withing the `looking_glass` domain, the intro sentence doesn't really make much sense, consider rewriting with a different motivation, e.g., provide context or possible reasons for domain transferring; alternatively, rewrite tutorial #4 with the `wonderland` domain in mind -->

We could change the keys and domain in `client.toml` at this point and continue working with the account we just created, but we wouldn't be able to do much in the `looking_glass` domain, as our new account is not the owner of thw `looking_glass` domain, and therefore cannot manage it.

To transfer an account from under the `wonderland` domain to the `looking_glass` domain, perform the following:

1. Run the transfer command:

   ```bash
   $ iroha domain transfer --id="looking_glass" --from "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland" --to "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"
   ```

2. Check that the ownership changed:

   ```bash
   $ iroha domain list all
   ```

1. Switch to the newly created account. For this, we need to modify the `public_key`, `private_key`, and `domain` in the `client.toml` config file with the credentials of the user we want to act as.

Note that here the domain of the user that we are switching to matches the one we just transferred. However, this is not a requirement. A user may be registered in one domain and own multiple others. When setting the domain in the configuration file, always use the one that your user is registered with.

::: details Expected result

The `account` section of your updated `client.toml` file:

```toml
[account]
domain = "looking_glass"
public_key = "ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379"
private_key = "802620CBD3D701B561FE98463767729176404DC757D690F78980B8FDD40C171CCB8EB5"
```

:::

::: tip
[Permissions](/guide/blockchain/permissions) determine accounts rights within Iroha. Domain owners have the most rights in a domain by default, but permission configuration in Iroha is very flexible and can be customized to your needs.
:::

Now that we control the domain, we can define and manage assets in it.

## 6. Register and Mint Assets

To mint an asset, its [asset definition](/guide/blockchain/assets) must be registered first.

To register a `tea` token within the `looking_glass` domain, run:

```bash
$ iroha asset definition register --id="tea#looking_glass" --type="Numeric"
```

The numeric `tea` asset is now registered within the `looking_glass` domain.

If you open the terminal where the Iroha network runs, you will see that all our activity caused numerous pipeline events there.

To mint `tea` tokens run:

```bash
$ iroha asset mint --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass" --quantity="100"
```

After minting one hundred `tea`, more pipeline events are expected, and you can also query the assets that you have just minted:

```bash
$ iroha asset list all
```

::: details Expected result

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

After minting the assets, you can transfer some of your `tea` to another account:

```bash
$ iroha asset transfer --to="ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland" --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass"  --quantity=33
```

## 8. Burn Assets

Burning assets is quite similar to minting them:

```bash
$ iroha asset burn --id="tea##ed0120ABA0446CFBD4E12627FFA870FB37993ED83EB1AE0588184B90D832A64C24C379@looking_glass" --quantity="15"

```

## 9. Visualize Outputs

Although you will get a constant data feed of the network within the terminal running `docker compose`, you can also configure an output to listen to events of several types on the network: blocks generation, transactions, data events and triggers.

We will set up an event listener for the block pipeline.

From a new terminal tab/window run:

```bash
$ iroha events block-pipeline
```

::: details Expected result

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

::: tip

To find out how to listen to other types of events, run the `iroha events help` command.

:::

## What's Next

<!-- TODO: either remove this section entirely, or send the reader to other parts of the docs, e.g., **Blockchain**, **Reference**, also consider describing the motivation to explore other parts of the docs -->

Now that you know the basics, you can proceed to one of our language-specific [turorials](/guide/get-started/tutorials) to learn how to build on Iroha.
