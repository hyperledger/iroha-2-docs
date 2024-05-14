# Genesis Parameters

This module configures the [genesis](/reference/genesis) block.

## `genesis.file` {#param-file}

<ConfigParameterSpecs type="file-path" env="GENESIS_FILE" />

The file path to the [Genesis JSON](/reference/genesis).

::: code-group

```toml [Config File]
[genesis]
file = "genesis.json"
```

```sh [Environment]
GENESIS_FILE="genesis.json"
```

:::

::: tip Path Resolution

[Paths resolution rules](glossary#paths-resolution) apply to this
parameter.

:::

## `genesis.private_key` {#param-private-key}

## `genesis.public_key` {#param-public-key}

The public key of the genesis account.

::: code-group

```toml [Config File]
[genesis]
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```

```shell [Environment]
GENESIS_PUBLIC_KEY=ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9
```

:::
