# Client Configuration

<!-- TODO: Change this intro after config reference is part of this doc -->

This tutorial will not go into details about the options you can adjust
with the client configuration settings. Instead, we will provide a broad
overview of what is available in Iroha 2.

Check
[Iroha Configuration Reference](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/config.md)
for all available options.

<!-- TODO: Make configs part of this repo
https://github.com/hyperledger/iroha-2-docs/issues/175
-->

::: details Client Configuration (`config.json`) Example

```json
{
  "TORII_API_URL": "http://127.0.0.1:8080",
  "ACCOUNT_ID": {
    "name": "alice",
    "domain_id": {
      "name": "wonderland"
    }
  },
  "BASIC_AUTH": {
    "web_login": "mad_hatter",
    "password": "ilovetea"
  },
  "PUBLIC_KEY": "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0",
  "PRIVATE_KEY": {
    "digest_function": "ed25519",
    "payload": "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"
  },
  "LOGGER_CONFIGURATION": {}
}
```

:::

## `TORII_API_URL`

First, the `TORII_API_URL` is the same as `TORII` `API_ADDR` in the
[peer configuration](peer-configuration.md). This is the module responsible
for handling incoming and outgoing connections. You should also add either
`http://` or (_preferably_) `https://` to the address.

If you are
[setting up an Iroha peer](register-unregister.md#registering-peers), you
should set up a domain for public blockchains. Bare connections[^1] are
enough for a local private deployment.

## `ACCOUNT_ID`

The `ACCOUNT_ID` should be self-explanatory: the only thing you need to
worry about, is that the account must exist in the blockchain. In the
[example `genesis.json`](genesis.md), you can see how we set up the
_alice_@wonderland account.

[^1]:
    We're using `HTTP` to connect to Iroha API. An alternative to that is
    the [HTTPS](https://en.wikipedia.org/wiki/HTTPS) connection, which
    wraps `HTTP` in
    [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security#SSL_1.0,_2.0,_and_3.0).
