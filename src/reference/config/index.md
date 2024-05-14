# Configuring Iroha

Iroha is configured via a [TOML](https://toml.io/) file and/or Environment
Variables.

The path to the configuration file should be passed through the
[`--config` CLI argument](/reference/cli#arg-config):

```shell
iroha --config iroha_config.toml
```

If the peer submits the genesis:

```shell
# `iroha_config.toml` should contain `genesis.file` and `genesis.private_key`
iroha --config iroha_config.toml --submit-genesis
```

## Structure

- List links to all modules, giving high-level overview of them
- List required parameters

| Module Name                     | Description                  | Required fields                                                           |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| [Base](base-params)             | Basic, root-level parameters | `chain_id`, `public_key`, `private_key`                                   |
| [Genesis](genesis-params)       | Genesis block configuration  | `genesis.public_key`, and possibly `genesis.file` & `genesis.private_key` |
| [Network](network-params)       | ?                            | `network.address`                                                         |
| [Torii](torii-params)           | ?                            | `torii.address`                                                           |
| [Sumeragi](sumeragi-params)     | ?                            | `sumeragi.trusted_peers` if doesn't submit the genesis                    |
| [Kura](kura-params)             | ?                            |                                                                           |
| [Queue](queue-params)           | ?                            |                                                                           |
| [Snapshot](snapshot-params)     | ?                            |                                                                           |
| [Logger](logger-params)         | ?                            |                                                                           |
| [Telemetry](telemetry-params)   | ?                            |                                                                           |
| [Chain Wide](chain-wide-params) | ?                            |                                                                           |

## Example Configuration

- Show minimal TOML
- Show same minimal ENVs
- Refer to `peer.template.toml` in the repo, or show it here under the
  spoiler.

## Extends feature

- You can compose configuration files together using the `extends`
  root-level field

---

## Required Parameters

- [`public_key`](base-params#param-public-key): _explain the option_
- [`private_key`](base-params#param-private-key): _explain the option_
- [`network.address`](network-params#param-address): _explain the option_
- [`genesis.public_key`](genesis-params#param-public-key): _explain the
  option_
- [`genesis.private_key`](genesis-params#param-private-key) if the peer
  is the one who submits the genesis. _explain the option_
- [`sumeragi.trusted_peers`](sumeragi-params#param-trusted-peers):
  _explain the option_. It is not _strictly_ required, but you might need
  to set it in most cases.
- [`torii.address`](torii-params#param-address): _explain the option_

## Modules Overview

TODO: list each section (sumeragi, torii, kura etc) with links and short
explanations of their responsibility.

- **[Base Options](base-params):** _explain_
- **[Genesis](genesis-params):** _explain_
- **[Sumeragi](sumeragi-params):** _explain_
- **[Torii](torii-params):** _explain_
- **[Queue](queue-params):** _explain_
- **[Kura](kura-params):** _explain_
- **[Logger](logger-params):** _explain_
- **[Telemetry](telemetry-params):** _explain_
- **[Snapshot](./snapshot-params)**
