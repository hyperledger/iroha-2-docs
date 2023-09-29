# Torii Parameters

TODO: Explain Torii module

## `torii.api_address`

- **ENV:** `API_ENDPOINT`
- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address of the client API.

```toml
[torii]
api_address = "localhost:8080"
```

## `torii.telemetry_address`

- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Optional**

Address for reporting internal status and metrics for administration.

::: info

This section differs from the [Telemetry](telemetry-params) section. This
parameter is regarding "passive" telemetry requested by external actors, while that
section is about "active" outbound telemetry, actively produced by Iroha.

:::

## `torii.max_transaction_size`

- **Type:** String or Number, [Byte Size](glossary#type-byte-size)
- **Default:** $2^{15} = 32\ 768$

The maximum number of bytes in a raw transaction. Used to prevent DOS
attacks.

## `torii.max_content_len`

- **Type:** String or Number, [Byte Size](glossary#type-byte-size)
- **Default:** $2^{12} \cdot 4\ 000 = 16\ 384\ 000$

The maximum number of bytes in a raw message. Used to prevent DOS attacks.

## `torii.results_per_fetch`

- **Type:** Number
- **Default:** $10$

The number of query results returned in one batch

TODO: I don't really get what it is related to. Server-side cursor?

## `torii.query_idle_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 30 seconds

The time a query can remain in the store if unaccessed
