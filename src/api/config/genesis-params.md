# Genesis Parameters

Explain the purpose of this block. Maybe explain both keys in a single
section?

## `genesis.public_key`

- **Type:** [Multi_hash](glossary#type-multi-hash)
- **Required**

The public key of the genesis account, should be supplied to all peers.

```toml
[genesis]
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```


## `genesis.private_key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Required** if the configured peer submits the genesis block, **optional** otherwise

The private key of the genesis account, only needed for the peer that
submits the genesis block.


```toml
[genesis]
private_key = { digest = "ed25519", payload = "82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B" }
```


::: info

This parameter is required if the peer being configured submits the
genesis, i.e. if it is run with the [`--submit-genesis`](../cli#submit-genesis)
 CLI argument.

:::

::: warning



The warning will be printed if the
[`genesis.private_key`](#genesis-private-key) and
[`--submit-genesis`](../cli#submit-genesis) are used without each other.

:::
