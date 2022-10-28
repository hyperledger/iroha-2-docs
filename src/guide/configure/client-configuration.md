# Client Configuration

Let's look at the client configuration options.

::: details Client configuration example

<<< @/guide/configure/configs/client-cli-config.json

:::

## Public and Private Keys

Client configuration files should contain the pair of public (`PUBLIC_KEY`)
and private (`PRIVATE_KEY`) keys for the user account (`ACCOUNT_ID`).

Refer to the chapter on public key cryptography for more details:

- [Keys for Deploying a Network](./keys.md#keys-for-deploying-a-network)
- [Keys on the Client side](./keys.md#keys-on-the-client-side)

## User account

The `ACCOUNT_ID` should be self-explanatory. The only thing you need to
worry about is that the account must already exist in the blockchain. In
other words, the account you provide here should already be
[registered](./../advanced/isi.md#un-register).

::: info Note

Iroha is **case-sensitive**, meaning that _Alice_@wonderland is different
from _alice_@wonderland. It should go without saying that
_alice@wonderland_ is not the same as _alice@looking_glass_ either, since
these accounts belong to different domains, `wonderland` and
`looking_glass`.

:::

## Basic Authentication Credentials

Provide basic authentication credentials (login and password):

```json
  "BASIC_AUTH": {
    "web_login": "mad_hatter",
    "password": "ilovetea"
  },
```

## Iroha Public Addresses

`TORII` is the module in charge of handling incoming and outgoing
connections. For client configuration, you can set up two addresses:
`TORII_API_URL` and `TORII_TELEMETRY_URL`.

### `TORII_API_URL`

First, the `TORII_API_URL` is the same as `TORII` `API_URL` in the
[peer configuration](peer-configuration.md#api_url). This is the module
responsible for handling incoming and outgoing connections. You should also
add the prefix `http://` or (_preferably_) `https://` to the address. For
example:

```json
"TORII_API_URL": "http://127.0.0.1:8080"
```

### `TORII_TELEMETRY_URL`

The `TORII_TELEMETRY_URL` is used to specify the prometheus endpoint
address. You can set `TORII_TELEMETRY_URL` like this:

```json
"TORII_TELEMETRY_URL": "http://127.0.0.1:8180"
```

A `GET` request to the `127.0.0.1:8180/status` will give you a JSON-encoded
representation of the top-level metrics, while a `GET` request to
`127.0.0.1:8180/metrics` will give you a (somewhat verbose) list of all
available metrics gathered in Iroha. You might want to change this if
you're having trouble gathering metrics using `prometheus`.

::: info

Learn how to [monitor Iroha performance](./../advanced/metrics.md) using
prometheus.

:::

## Transaction Limits

You can specify the transaction limits that each transaction must adhere
to: the maximum number of instructions and the maximum size of a WASM blob
(in bytes). For example:

```json
{
  "max_instruction_number": 4096,
  "max_wasm_size_bytes": 4194304
}
```

## Transaction TTL and Timeout

Configure the time-to-live (TTL) for transactions and the timeout to wait
for the status. Both values have to be provided in milliseconds. For
example:

```json
"TRANSACTION_TIME_TO_LIVE_MS": 100000,
"TRANSACTION_STATUS_TIMEOUT_MS": 15000,
```

## Transaction Nonce

If you set `ADD_TRANSACTION_NONCE` to `true`, Iroha will create different
hashes for transactions that occur repeatedly and simultaneously.
