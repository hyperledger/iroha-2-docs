# Torii Parameters

TODO: Explain Torii module

This module contains configuration of [Torii](/reference/glossary#torii-gate) - the API gateway of Iroha. Refer to the
[Torii Endpoints reference](/reference/torii-endpoints) for information about exact endpoints.

## `torii.address`

- **ENV:** `API_ENDPOINT`
- **Type:** String, [Socket-Address](glossary#type-socket-address)
- **Required**

Address on which Torii Endpoints will be accessible.

```toml
[torii]
api_address = "localhost:8080"
```

## `torii.max_content_length`

- **Type:** String or Number, [Byte Size](glossary#type-byte-size)
- **Default:** $16\ 000\text{ KiB}$ ($2^{10} \cdot 16\ 000 = 16\ 384\ 000\text{ bytes}$)

TODO: consider changing the default value to 16 MiB precisely (which is $2^{20} * 16 = 16\ 777\ 216$)

The maximum number of bytes in a raw request body accepted by the
[Transaction Endpoint](/reference/torii-endpoints#transaction). This limit is used to prevent DOS attacks.

**Example:**

```toml
[torii]
max_content_length = "16MiB"
```

## `torii.query_idle_time`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 30 seconds

The time a query can remain in the store if unaccessed.

TODO: Configures behaviour of lazily-evaluated pagination of the [Query Endpoint](/reference/torii-endpoints#query).

**Example:**

```toml
[torii]
query_idle_time = "30s"
```

## `torii.query_results_per_fetch`

- **Type:** Number
- **Default:** $10$

The number of query results returned in one batch.

TODO: Configures behaviour of lazily-evaluated pagination of the [Query Endpoint](/reference/torii-endpoints#query).

**Example:**

```toml
[torii]
query_results_per_fetch = 10
```
