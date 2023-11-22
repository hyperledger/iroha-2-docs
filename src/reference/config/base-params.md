# Base Parameters

## `address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address for p2p communication for consensus (sumeragi) and block synchronization (block_sync) purposes.

```toml
address = "localhost:1337"
```

## `private_key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Required**

Private key of this peer

```toml
private_key.digest = "ed25519"
private_key.payload = "82886B5A2BB3785F3CA8F8A78F60EA9DB62F939937B1CFA8407316EF07909A8D236808A6D4C12C91CA19E54686C2B8F5F3A786278E3824B4571EF234DEC8683B"
```

## `public_key`

- **Type:** String, [Multi-hash](glossary#type-multi-hash)
- **Required**

Public key of this peer

```toml
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```
