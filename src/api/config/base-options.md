# Base Options

## `public-key`

- **Type:** String, [Multi-hash](glossary#type-multi-hash)
- **Required**

Public key of this peer

```toml
[iroha]
public-key = ""
```

## `private-key`

- **Type:** Table, [Private Key](glossary#type-private-key)
- **Required**

Private key of this peer

```toml
[iroha]
private-key = { digest = "", payload = "" }
```
