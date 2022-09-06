# Peer Configuration

The peer configuration file (`/configs/peer/config.json`) determines how
your blockchain operates.

Let's take a closer look at the configurations you'll work with when you
create a network: `TRUSTED_PEERS`, `KURA`, `TORII`, and `LOGGER`. We'll
cover the `PUBLIC_KEY` and `PRIVATE_KEY` later when we talk about
[public key cryptography](keys.md).

The remaining options are for fine-tuning Iroha, so you don't need to worry
about them at this stage. Once you are familiar with the necessary basics,
check
[Iroha Configuration Reference](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/config.md)
for more details and all available options.

## Trusted Peers

Iroha is a blockchain ledger. In order for it to work optimally and be
Byzantine-fault tolerant with the maximum number of faults allowed, it
needs to be started with a set number of peers: `4`, `7`, `10`, ... `3f+1`,
where `f` is the allowed number of faults.

So usually, when you want to start an Iroha deployment, you should already
know a number of peers that you can trust and join their blockchain. The
way it works in the examples is that you just specify in four `config.json`
files four peers with their public keys and API addresses.

Since Iroha has no automatic peer discovery, the only other way to make
peers known to each other is to use the `iroha_client_cli` to register new
peers. This is not too difficult with the provided client libraries. With
Python's Beautiful Soup, the curated list of peers can be updated,
registered, and un-registered on its own.

## Kura

KURA is the "warehouse" engine of Iroha. The `BLOCK_STORE_PATH` specifies
where the blocks are stored. You can change it to a custom location if for
some reason the default location (`./storage`) is not available or
desirable.

For more details, check
[`KURA` configuration reference](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/config.md#kura).

## Iroha Public Addresses

`TORII` is the module in charge of handling incoming and outgoing
connections.

Here we only cover the `API_URL`, `P2P_ADDR`, and `TELEMETRY_URL`
configurations. On Github you'll find
[the detailed reference for `TORII`](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/config.md#torii).

### `API_URL`

The `API_URL` is the location to which the client(s) make their requests.
You can also use it to change some peer-specific configuration options.

Most of the time, the only reason to change the `API_URL` is to change the
port, in case `8080` is either closed, or if you want to randomise ports to
avoid certain kinds of attacks.

### `P2P_ADDR`

The `P2P_ADDR` is the internal address used for communication between
peers. This address should be included in the `TRUSTED_PEERS` section of
the configuration file.

### `TELEMETRY_URL`

The `TELEMETRY_URL` is used to specify the prometheus endpoint address.
It's set by adding `"TELEMETRY_URL": "127.0.0.1:8180"` to the `TORII`
section of the configuration file.

It's not meant to be human-readable. However, a `GET` request to the
`127.0.0.1:8180/status` will give you a JSON-encoded representation of the
top-level metrics, while a `GET` request to `127.0.0.1:8180/metrics` will
give you a (somewhat verbose) list of all available metrics gathered in
Iroha. You might want to change this if you're having trouble gathering
metrics using `prometheus`.

## Logger

Let's cover the most useful `LOGGER` configurations, `MAX_LOG_LEVEL` and
`LOG_FILE_PATH`.

### `MAX_LOG_LEVEL`

The `MAX_LOG_LEVEL` is used to determine which messages are logged.

With `"MAX_LOG_LEVEL": "WARN"` you won't get any messages unless they are
either a warning or an error. Beside `WARN`, other available options are:

- `TRACE` (log every time you enter a function)
- `DEBUG` (use when you know something went wrong)
- `INFO` (the default)
- `WARN` (log everything that could be an error)
- `ERROR` (to silence any logging except for error messages)

### `LOG_FILE_PATH`

Another useful option is `"LOG_FILE_PATH": bunyan.json`. It creates (if it
didn't already exist) a file called `bunyan.json` that contains the message
log in a structured format.

This is extremely useful for two reasons. Firstly, you can use the `bunyan`
log viewer to filter information more precisely than Iroha would allow you
to do. Do you only want messages from a specific module or package? You can
do that with `bunyan`. Secondly, while copying logs is not too big of a
problem if your instance is just a small setup, for bigger setups the log
will be larger. Having it saved to a file makes much more sense in that
case.

::: info

You can also set `LOG_FILE_PATH` to `/dev/stdout` if you want to use
bunyan's logging facilities directly without saving the output.

:::
