# Peer Configuration

The peer configuration JSON `/configs/peer/config.json` is the file that determines how your blockchain operates: we won't look at it now, but really the only things that you need to worry about are the `TRUSTED_PEERS` , the `KURA` `BLOCK_STORE_PATH` and the `TORII` `P2P_ADDR` and `API_ADDR`.
The `PUBLIC_KEY` and `PRIVATE_KEY` options will be covered at a later stage. The remaining options are for tuning Iroha, so you don't want to touch them unless you know what you're doing.

## Trusted peers

Iroha is a blockchain ledger. In order for it to work optimally and be Byzantine-fault tolerant with the maximum number of faults allowed, it needs to be started with a set number of peers: 4, 7, 10 … 3f+1, where f is the number of faults. So usually, when you want to start an Iroha deployment you should already know a number of peers that you can trust and join their blockchain. The way it works in the examples, is that you just specify in four`config.json` files four peers with their public keys and API addresses.
Since Iroha has no automatic peer discovery, the only other way to make peers known to each other is to use the `iroha_client_cli` to register new peers. This is not too difficult with the provided client libraries. In fact using Python’s beautiful soup, the curated list of peers can be updated, registered and un-registered on its own.

## Kura

Kura is the “warehouse” engine of Iroha; it can store blocks in custom locations, if for some reason `./blocks` is not available or desirable. There are plans to make the Iroha’s storage tiered: when you reach a certain number of blocks, they get moved elsewhere.
The `KURA` init mode at present does nothing. In the future, it will affect whether or not your block storage does a `strict` initialisation: checks everything, or a `fast` one, where everything is “probably alright™”.

## Iroha public addresses

`TORII` the gatekeeper is the module in charge of handling in-coming and out-going connnections.
The `API_URL` is the location to which the client(s) make their requests. You can use it to change some peer-specific configuration options too. While we could give you the examples here, the only up-to-date description can be found in the Iroha’s immediate [documentation on GitHub](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/api_spec.md). Most of the time, the only reason to change the `API_URL` is to change the port, in case `8080` is either closed, or if you want to randomise ports to avoid certain kinds of attacks.
The `P2P_ADDR` is the internal address used for communication between peers. Take note of **this address** for inclusion in the `TRUSTED_PEERS` section of the configuration file.
Lastly, (and not in the example configuration) you have the prometheus endpoint address. It’s set by adding a value `"TELEMETRY_URL": "127.0.0.1:8180"`, to the `TORII` section. It’s not meant to be human-readable, but a `GET` request to the `127.0.0.1:8180/status` will give you a JSON-encoded representation of the top-level metrics, while a `GET` request to `127.0.0.1:8180/metrics` will give you a (somewhat verbose) list of all available metrics gathered in Iroha. You might want to change this, if you’re having trouble gathering metrics using `prometheus`.

## Logger

This is possibly the easiest to understand. `"MAX_LOG_LEVEL": "WARN"`, changes the logging level to `WARN`. This means that you don’t get any messages, unless they’re either a warning or an error message. The available options are `TRACE` (every time you enter a function), `DEBUG` information that we use when we know something went wrong, `INFO` the default, `WARN` and `ERROR`, which silences any logging except for error messages.

Another useful option is `"LOG_FILE_PATH": bunyan.json` . It creates (if it didn’t exist already) a file called `bunyan.json` that contains the message log but in a structured format. This is extremely useful for two reasons: first, you can use the `bunyan` log viewer to filter information more precisely than Iroha would allow you to do. _Want only messages from a specific module or package? You can do that with bunyan_. Secondly, while copying logs is not too big of a problem if your instance is just a small setup, for bigger and longer running the process the larger the log will be. Having it be saved to a file makes much more sense in that case.

::: info

you can also set this to `/dev/stdout` if you want to use bunyan’s logging facilities directly, but don’t want to waste space in the filesystem).

:::
