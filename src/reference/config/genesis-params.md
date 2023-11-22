# Genesis Parameters

This module configures how Iroha handles genesis block.

Each peer must have [`genesis.public_key`](#genesis-public-key) set in order to verify the genesis block. Only one peer in the network is
responsible for submitting the block, and for that one [`genesis.private_key`](#genesis-private-key) and [`genesis.file`](#genesis-file) must be specified
together in addition to [`genesis.public_key`](#genesis-public-key).

For example, a peer that submits the genesis should have the following config:

```toml
[genesis]
public_key = "..."
private_key = "..."
file = "./genesis.json"
```

In the meantime, all other peers should only have [`genesis.public_key`](#genesis-public-key) specified:

```toml
[genesis]
public_key = "..."
```

## `genesis.file`

- **Type:** String, file path
- **Optional**, must be paired with [`genesis.private_key`](#genesis-private-key)
- **ENV:** `GENESIS_FILE`

The file path to the Genesis JSON (link).

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

Path is resolved relatively to the config file location. If this parameter is set through ENV, then the path is resolved
relatively to the Current Working Directory.

:::


## `genesis.private_key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Optional**, must be paired with [`genesis.file`](#genesis-file)
- **ENV:** `GENESIS_PRIVATE_KEY` (TODO: or split to DIGEST + PAYLOAD?)

The private key of the genesis account, only needed for the peer that submits the genesis block.

::: code-group

```toml [Config File]
[genesis]
private_key.digest = "ed25519"
private_key.payload = "82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B"
```

```shell [Environment]
GENESIS_PRIVATE_KEY="{\"digest\":\"ed25519\",\"payload\":\"82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B\"}"
```

:::

## `genesis.public_key`

- **Type:** [Multi-hash](glossary#type-multi-hash)
- **Required**
- **ENV:** `GENESIS_PUBLIC_KEY`

The public key of the genesis account, should be supplied to all peers.

::: code-group

```toml [Config File]
[genesis]
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```

```shell [Environment]
GENESIS_PUBLIC_KEY=
```


:::

