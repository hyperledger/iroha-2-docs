# Base Options

## `public_key`

- **Type:** String, [Multi-hash](glossary#type-multi-hash)
- **Required**

Public key of this peer

```toml
[iroha]
public_key = ""
```

## `private_key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Required**

Private key of this peer

```toml
[iroha]
private_key = { digest = "", payload = "" }
```
