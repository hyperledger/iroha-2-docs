# Torii Options

Explain Torii module

## `torii.api-address`

- **ENV:** `API_ENDPOINT`
- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address for client API.

```toml
[torii]
api-address = "localhost:8080"
```

## `torii.telemetry-address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Optional**

address for reporting internal status and metrics for administration.

::: info

This is different from [Telemetry](telemetry-options) section. This parameter is
about "passive" telemetry, requested by external actors. That section is
about "active" outbound telemetry, actively produced by Iroha.

:::

## `torii.max-transaction-size`

- **Type:** String or Number, [Byte Size](glossary#type-byte-size)
- **Default:** $2^{15} = 32\ 768$

Maximum number of bytes in raw transaction. Used to prevent from DOS
attacks.

## `torii.max-content-len`

- **Type:** String or Number, [Byte Size](glossary#type-byte-size)
- **Default:** $2^{12} \cdot 4\ 000 = 16\ 384\ 000$

Maximum number of bytes in raw message. Used to prevent from DOS attacks.

## `torii.fetch-size`

TODO: use "amount" instead of size. Usually "size" means bytes in this
document

- **Type:** Number
- **Default:** $10$

How many query results are returned in one batch

## `torii.query-idle-time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 30 seconds

Time query can remain in the store if unaccessed
