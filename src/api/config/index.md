# Configuring Iroha

::: danger WORK IN PROGRESS

It is not implemented yet. Early draft document according to the RFC.

:::

When running `iroha` from the command line, Iroha will try to resolve a
config file named `iroha.toml` inside the current working directory. Then it tries to read a set of
Environment Variables associated with configuration parameters. The most
basic `iroha.toml` config file looks like this:

```toml
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
private_key = { digest = "ed25519", payload = "82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B" }

[network]
# peer-to-peer communication address
address = "localhost:1337"

[torii]
api_address = "localhost:8080"
```

The path to the configuration file can be overwritten either with
`--config` CLI argument, or with `IROHA_CONFIG` environment variable:

::: code-group

```bash [With --config]
$ iroha --config ./cfg.toml
```

```bash [With IROHA_CONFIG]
$ IROHA_CONFIG=/path/to/config/iroha.toml iroha
```

:::

Additionally, Iroha reads a set of Environment Variables, associated with
configuration parameters. Values from ENV override values from the config
file. For example:

::: code-group

```shell [ENV variables]
PUBLIC_KEY=ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9
PRIVATE_KEY="{\"digest\":\"ed25519\",\"payload\":\"82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B\"}"
NETWORK_ADDRESS=localhost:1337
TORII_API_ADDRESS=localhost:8080
```

```toml [Equivalent in TOML]
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
private_key = { digest = "ed25519", payload = "82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B" }
address = "localhost:1337"

[torii]
api_address = "localhost:8080"
```

:::

Please refer to each field's documentation for specific ENV names.

::: tip Debugging

To trace how configuration is resolved, run `iroha` with
[`--trace-config`](../cli#trace-config) flag:

```bash
$ iroha --trace-config
```

The output will be something like:

```
TODO: sample output
```

TODO: maybe also enable with `IROHA_CONFIG_TRACE=1` env var?

:::

## TOML Format

Iroha uses the [TOML (Tom's Obvious Minimal Language)](https://toml.io/) format
for its configuration. Please refer to its documentation if you need
assistance with how it works.

## Required Parameters

- [`public_key`](base-params#public-key): _explain the option_
- [`private_key`](base-params#private-key): _explain the option_
- [`address`](base-params#address): _explain the option_
- [`genesis.public_key`](genesis-params#genesis-public-key): _explain the
  option_
- [`genesis.private_key`](genesis-params#genesis-private-key) if the peer
  is the one who submits the genesis. _explain the option_
- [`sumeragi.trusted_peers`](sumeragi-params#sumeragi-trusted-peers):
  _explain the option_. It is not _strictly_ required, but you might need
  to set it in most cases.
- [`torii.address`](torii-params#torii-address): _explain the
  option_

## Modules Overview

TODO: list each section (sumeragi, torii, kura etc) with links and short explanations of their responsibility.

- **[Base Options](base-params):** _explain_
- **[Genesis](genesis-params):** _explain_
- **[Sumeragi](sumeragi-params):** _explain_
- **[Torii](torii-params):** _explain_
- **[Queue](queue-params):** _explain_
- **[Kura](kura-params):** _explain_
- **[Logger](logger-params):** _explain_
- **[WSV](wsv-params):** _explain_
- **[Telemetry](telemetry-params):** _explain_
- **[Snapshot](./snapshot-params)**

---

TODO:

- Consider refining `Number` types to exact `Integer`, `Float`,
  `Unsigned 64-bits integer`?
- Is `sumeragi.trusted_peers` optional or required?
- Define more ENVs, and provide samples of how it should be parsed
