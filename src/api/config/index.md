# Configuration Reference

::: warning WORK IN PROGRESS

It is not implemented yet. Early draft document according to the RFC.

:::

TODO:

-  [Transpose tables](https://github.com/rollup/rollup/blob/master/docs/.vitepress/transpose-tables.ts) ?
- Consider refining `Number` types to exact `Integer`, `Float`,
      `Unsigned 64-bits integer`?
- Explain "actor channel capacity" for users. What are actors, how to
      configure them. Maybe give some insight about each actor in
      particular.
- Is `sumeragi.trusted-peers` optional or required?
- Use `torii.fetch-amount` instead of `torii.fetch-size`. IMO size is
      better to preserve for "byte size". Same for
      `sumeragi.gossip-batch-size`, `block-sync.block-batch-size`.
- Define more ENVs

## How it works

How resolved: file, then ENV, then default values.

File might be set either with `IROHA_CONFIG` env var:

```bash
$ export IROHA_CONFIG=~/iroha.toml
$ iroha
```

Or with [`--config`](../cli#config) CLI argument:

```bash
$ iroha --config ./config.toml
```

::: tip

To trace how configuration is resolved, run Iroha with
[`--trace-config`](../cli#trace-config) flag:

```bash
$ iroha -c ./config.toml --trace-config
```

The output will be something like:

```
TODO: sample output
```

TODO: probably put extended information under the
[`--trace-config`](../cli#trace-config) CLI flag documentation in CLI
section

:::

### TOML Format

TODO: brief explanation of the format, links to guides/specs

## Minimal Configuration

Required fields are:

- [`public-key`](base-options#public-key)
- [`private-key`](base-options#private-key)
- [`genesis.public-key`](genesis-options#genesis-public-key)
- [`genesis.private-key`](genesis-options#genesis-private-key) if the peer is the one who
  submits the genesis
- [`network.address`](network-options#network-address)
- [`sumeragi.trusted-peers`](sumeragi-options#sumeragi-trusted-peers) (?)
- [`torii.api-address`](torii-options#torii-api-address)

Minimal configuration looks like:

```toml
# key pair of the peer itself
public-key = ""
private-key = {}

[network]
# address for peer-to-peer communication
address = "localhost:1337"

# list of the trusted peers

[[sumeragi.trusted-peers]]
address = ""
public-key = ""

[[sumeragi.trusted-peers]]
address = ""
public-key = ""

[torii]
# address for the API endpoint
api-address = "localhost:8080"
```

::: tip

Note that all the required fields has their equivalent in ENV. 

:::

## Options Overview

TODO: list each section (sumeragi, torii, kura etc) with links and short explanations of their responsibility.
