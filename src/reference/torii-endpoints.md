# Torii Endpoints

::: tip Note

Messages for certain `TORII` operations are encoded with Parity <abbr title="Simple Concatenated Aggregate Little-Endian">SCALE</abbr> Codec commonly used with the [Parity Substrate](https://www.parity.io/technologies/substrate/) blockchain framework, and other blockchains utilizing it.

For more information on Parity SCALE Codec, see the [Substrate Documentation: Type encoding (SCALE)](https://docs.substrate.io/reference/scale-codec/) article and its [official GitHub repository](https://github.com/paritytech/parity-scale-codec).

<!-- TODO: link to our own article about SCALE, once it is written; Issue: https://github.com/hyperledger/iroha-2-docs/issues/367 -->

:::

Torii (jap. 鳥居 - gates; Shinto shrine archway) is the Iroha module in charge of handling HTTP and WebSocket requests. It is the main application programmable interface to interact with Iroha. Such interactions include sending transactions, making queries, listening for blocks stream, and so on.

To establish two-way communication with the `TORII` endpoints, the following addresses must be specified in the Iroha 2 configuration files:

1. In the `configs/client_cli/config.json` client configuration file:
   - `TORII_API_URL` — connects to the `TORII` module responsible for handling incoming and outgoing connections.\
   This address is the same as the `API_URL` address in the `configs/peer/config.json` peer configuration file.
   - `TORII_TELEMETRY_URL` — connects to the [Prometheus](https://prometheus.io/) endpoint address that is used as a [metrics](../guide/advanced/metrics.md) tool to monitor the network performance.

   ::: info

   To learn more, see [Client Configuration > Iroha Public Addresses](../guide/configure/client-configuration.md#iroha-public-addresses).

   :::

2. In the `configs/peer/config.json` peer configuration file:
   - `API_URL` — connects to the `TORII` module responsible for handling incoming and outgoing connections.\
   This address is the same as the `TORII_API_URL` address in the `configs/client_cli/config.json` client configuration file.
   - `TELEMETRY_URL` — connects to the [Prometheus](https://prometheus.io/) endpoint address that is used as a [metrics](../guide/advanced/metrics.md) tool to monitor the network performance.

   ::: info

   To learn more, see [Peer Configuration > Iroha Public Addresses](../guide/configure/peer-configuration.html#iroha-public-addresses).

   :::

## API Version

- **Protocol**: `HTTP`
- **Method**: `GET`
- **Encoding**: `JSON`
- **Endpoint**: `/api_version`

#### Requests

A `GET` request to the endpoint.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 200  | OK                    | Returns the current version of the API used by Iroha 2.                       |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

**Example**:

```json
200 OK: "1"
```

::: info

The API version is retrieved from and is the same as the version of the [genesis block](../guide/configure/genesis.md), which means that at least a minimal subnet of four peers must be running, and the genesis block must already be submitted at the time of the request.

:::

## Blocks Stream

- **Protocols**: `HTTP` upgraded to `WebSocket`
- **Encoding**: `SCALE`
- **Endpoint**: `/block/stream`

#### Handshake

Since the `/block/stream` endpoint handles continuous two-way data exchange, a `WebSocket` handshake between the client and server must first be performed to initiate communication with this endpoint.

The first HTTP request to this endpoint requires a standard set of `WebSocket` headers.

**Example**:

```http
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13
Sec-WebSocket-Extensions: permessage-deflate, client_max_window_bits
```

#### Data Exchange

After a successful handshake, the client must send a [`BlockSubscriptionRequest`](/reference/data-model-schema#blocksubscriptionrequest) request with the starting block number provided (i.e., the `height` value). Then, upon sending the confirmation and [`BlockMessage`](/reference/data-model-schema#blockmessage) messages, the server starts streaming all of the blocks, beginning with the block specified with `height` up to the most recent one, and then continues to stream new blocks as they are added to the blockchain.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 101  | Switching Protocols   | The protocol is successfully switched from `HTTP` to `WebSocket`.             |
| 400  | Bad Request           | The server will not process the request due to an issue on the client side.   |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

## Configuration / Retrieve

- **Protocol**: `HTTP`
- **Method**: `GET`
- **Encoding**: `JSON`
- **Endpoint**: `/configuration`

#### Requests

A `GET` request to the endpoint.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 200  | OK                    | Returns a subset of configuration parameters serialized into JSON format.     |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

**Example**:

```json
{
  "logger": {
    "level": "TRACE"
  }
}
```

::: info

The subset of configuration parameters returned by this operation is equal to the one accepted by the [Configuration / Update](#configuration-update) operation, i.e., it only contains the `logger.level` parameter as of now.

:::

## Configuration / Update

- **Protocol**: `HTTP`
- **Method**: `POST`
- **Encoding**: `JSON`
- **Endpoint**: `/configuration`

#### Requests

This endpoint expects a subset of configuration parameters serialized into JSON format. Currently, it only supports dynamic updating of the `logger.level` parameter.

::: info

The list of all accepted values is currently unavailable and will be a part of the configuration reference that is still <abbr title="Work in Progress">WIP</abbr>.

Until then, to get assistance with the acceptable values and their definitions, consult [Receive Support](../guide/support.md) for ways to contact us.

The progress on the configuration reference can be tracked in the following GitHub issue:\
[iroha-2-docs > Issue #392: Tracking issue for Configuration Reference as per RFC](https://github.com/hyperledger/iroha-2-docs/issues/392).

:::

**Example**:

```json
{
  "logger": {
    "level": "DEBUG"
  }
}
```

#### Responses

| Code | Response              | Description                                                                     |
| :--: | --------------------- | ------------------------------------------------------------------------------- |
| 202  | Accepted              | The request to update the configuration is accepted and is due to be processed. |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                             |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request.   |

::: tip Guarantees

A successful configuration update does not guarantee that the configuration is indeed updated. While a follow-up [Configuration / Retrieve](#configuration-retrieve) request will return updated values, the actual update is performed asynchronously.

:::

## Events

- **Protocol**: `HTTP` upgraded to `WebSocket`
- **Encoding**: `SCALE`
- **Endpoint**: `/events`

### Transaction Events

The status of a transaction event can be one of the following:

- `Validating` — The transaction has been successfully submitted and is currently being validated by peers.
- `Committed` — The transaction has been successfully validated and is committed to the blockchain.
- `Rejected` — The transaction has been rejected by at least one peer and is __not__ committed to the blockchain.

All transactions are designated with the `Validating` status upon creation, which later proceeds to either `Committed` or `Rejected`. However, due to the distributed nature of the network, some peers might receive events out of order (e.g., `Committed` before `Validating`).

Some peers in the network may be offline for the validation round. If a client connects to them while they are offline, the peers might not respond with the `Validating` status. But when the offline peers come back online they will automatically synchronize the blocks. These peers are then guaranteed to respond with either `Committed` or `Rejected` status, depending on the information found in the block.

#### Handshake

Since the `/events` endpoint handles continuous two-way data exchange, a `WebSocket` handshake between the client and server must first be performed to initiate communication with this endpoint.

The first HTTP request to this endpoint requires a standard set of `WebSocket` headers.

**Example**:

```http
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13
Sec-WebSocket-Extensions: permessage-deflate, client_max_window_bits
```

#### Data Exchange

After a successful handshake, the client must send an [`EventSubscriptionRequest`](/reference/data-model-schema#eventsubscriptionrequest) request, after which the server sends an [`EventMessage`](/reference/data-model-schema#eventmessage) response.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 101  | Switching Protocols   | The protocol is successfully switched from `HTTP` to `WebSocket`.             |
| 400  | Bad Request           | The server will not process the request due to an issue on the client side.   |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

## Health

- **Protocol**: `HTTP`
- **Method**: `GET`
- **Encoding**: `JSON`
- **Endpoint**: `/health`

#### Requests

A `GET` request to the endpoint.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 200  | Health Status         | Returns the current status of the peer submitting the request.                |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

**Example**:

```json
200 Health Status: "Healthy"
```

## Metrics

- **Protocol**: `HTTP`
- **Method**: `GET`
- **Encoding**: `JSON`
- **Endpoint**: `/metrics`

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 200  | Metrics               | Returns a report on 8 out of 10 Prometheus metrics.                           |
| 401  | Unauthorized          | The client lacks valid credentials for the request.                           |
| 500  | Internal Server Error | The server encountered an unexpected issue and could not fulfill the request. |

**Example**:

::: details Example `200 Metrics` response

```bash
# HELP accounts User accounts registered at this time
# TYPE accounts gauge
accounts{domain="genesis"} 1
accounts{domain="wonderland"} 1
# HELP block_height Current block height
# TYPE block_height counter
block_height 1
# HELP connected_peers Total number of currently connected peers
# TYPE connected_peers gauge
connected_peers 0
# HELP domains Total number of domains
# TYPE domains gauge
domains 2
# HELP tx_amount average amount involved in a transaction on this peer
# TYPE tx_amount histogram
tx_amount_bucket{le="0.005"} 0
tx_amount_bucket{le="0.01"} 0
tx_amount_bucket{le="0.025"} 0
tx_amount_bucket{le="0.05"} 0
tx_amount_bucket{le="0.1"} 0
tx_amount_bucket{le="0.25"} 0
tx_amount_bucket{le="0.5"} 0
tx_amount_bucket{le="1"} 0
tx_amount_bucket{le="2.5"} 0
tx_amount_bucket{le="5"} 0
tx_amount_bucket{le="10"} 0
tx_amount_bucket{le="+Inf"} 2
tx_amount_sum 26
tx_amount_count 2
# HELP txs Transactions committed
# TYPE txs counter
txs{type="accepted"} 1
txs{type="rejected"} 0
txs{type="total"} 1
# HELP uptime_since_genesis_ms Network up-time, from creation of the genesis block
# TYPE uptime_since_genesis_ms gauge
uptime_since_genesis_ms 54572974
# HELP view_changes Number of view_changes in the current round
# TYPE view_changes gauge
view_changes 0
```

:::

::: info

To learn more about metrics, see [Metrics](../guide/advanced/metrics.md).

:::

## Query

- **Protocol**: `HTTP`
- **Method**: `POST`
- **Encoding**: `SCALE`
- **Endpoint**: `/query`

#### Requests

This endpoint expects the following data:

  - **Body**: [`VersionedSignedQuery`](/reference/data-model-schema#versionedsignedquery)
  - **Parameters** (optional):
    - `start` — Specifies the `id` of a starting entry. A successful response will contain all entries newer than and including the `id` specified.\
    - `limit` — Specifies the exact number of retrieved `id` entries.\
    - `sort_by_metadata_key` — Specifies the metadata key of the `id` entries that will be returned.\
    - `fetch_size` — Specifies the maximum number of results that a response can contain.

#### Responses

| Code | Response         | Body                                                                                             |
| :--: | ---------------- | ------------------------------------------------------------------------------------------------ |
| 200  | Success          | [`VersionedBatchedResponse<Value>`](/reference/data-model-schema#versionedbatchedresponse-value) |
| 400  | Conversion Error | [`QueryExecutionFail::Conversion(String)`](/reference/data-model-schema#queryexecutionfail)      |
| 400  | Evaluate Error   | [`QueryExecutionFail::Evaluate(String)`](/reference/data-model-schema#queryexecutionfail)        |
| 401  | Signature Error  | [`QueryExecutionFail::Signature(String)`](/reference/data-model-schema#queryexecutionfail)       |
| 403  | Permission Error | [`QueryExecutionFail::Permission(String)`](/reference/data-model-schema#queryexecutionfail)      |
| 404  | Find Error       | [`QueryExecutionFail::Find(FindError)`](/reference/data-model-schema#queryexecutionfail)         |

::: info

The `200 Success` response returns results that are ordered by `id`, which use Rust's [PartialOrd](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html#derivable) and [Ord](https://doc.rust-lang.org/std/cmp/trait.Ord.html) traits.

:::

### Account Not Found 404

Whether each prerequisite object was found and [`FindError`](/reference/data-model-schema#finderror):

| Domain | Account | [`FindError`](/reference/data-model-schema#finderror)                     |
| :----: | :-----: | ------------------------------------------------------------------------- |
|   N    |    -    | [`FindError::Domain(DomainId)`](/reference/data-model-schema#finderror)   |
|   Y    |    N    | [`FindError::Account(AccountId)`](/reference/data-model-schema#finderror) |

### Asset Not Found 404

Whether each prerequisite object was found and [`FindError`](/reference/data-model-schema#finderror):

| Domain | Account | Asset Definition | Asset | [`FindError`](/reference/data-model-schema#finderror)                                     |
| :----: | :-----: | :--------------: | :---: | ----------------------------------------------------------------------------------------- |
|   N    |    -    |        -         |   -   | [`FindError::Domain(DomainId)`](/reference/data-model-schema#finderror)                   |
|   Y    |    N    |        -         |   -   | [`FindError::Account(AccountId)`](/reference/data-model-schema#finderror)                 |
|   Y    |    -    |        N         |   -   | [`FindError::AssetDefinition(AssetDefinitionId)`](/reference/data-model-schema#finderror) |
|   Y    |    Y    |        Y         |   N   | [`FindError::Asset(AssetId)`](/reference/data-model-schema#finderror)                     |

## Status

- **Protocol**: `HTTP`
- **Method**: `GET`
- **Encoding**: `JSON` or `SCALE`
- **Endpoint**: `/status`

#### Requests

A `GET` request to the endpoint.

This endpoint also accepts the following:

  - **Header**: Specifies the encoding of the retrieved data.\
  Can be set to one of the following:
    - `Accept: application/x-parity-scale` — the retrieved data is encoded with SCALE.
    - `Accept: application/json` — the retrieved data is encoded with JSON.

If no header is specified in the request, the `Accept: application/json` header is used by default.

#### Responses

| Code | Response              | Description                                                                   |
| :--: | --------------------- | ----------------------------------------------------------------------------- |
| 200  | Iroha Status          | Returns the Iroha network status report. The response is generated in accordance with the encoding specified in the header of the request and is specified in `Content-Type` response header.  |

The response body has the following structure:

```rust
struct Status {
    /// Number of connected peers, except for the reporting peer itself
    peers: u64,
    /// Number of committed blocks
    blocks: u64,
    /// Number of accepted transactions
    txs_accepted: u64,
    /// Number of rejected transactions
    txs_rejected: u64,
    /// Uptime since genesis block creation
    uptime: Uptime,
    /// Number of view changes in the current round
    view_changes: u64,
    /// Number of the transactions in the queue
    queue_size: u64,
}

struct Uptime {
    secs: u64,
    nanos: u32
}
```

::: details Examples

The following examples represent the same data:

::: code-group

```json [JSON]
{
  "peers": 4,
  "blocks": 5,
  "txs_accepted": 31,
  "txs_rejected": 3,
  "uptime": {
    "secs": 5,
    "nanos": 937000000
  },
  "view_changes": 2,
  "queue_size": 18
}
```

```[SCALE]
10 14 7C 0C 14 40 7C D9 37 08 48
```

:::

::: warning JSON Precision Lost

Almost all fields in the `Status` structure are 64-bit integers, and they are encoded in JSON as-is. Since native JSON's number type according to the specification effectively is `f64`, the precision might be lost on deserialization, for example, in [JavaScript's `JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

For more details, see the related [GitHub issue](https://github.com/hyperledger/iroha/issues/3964).

:::

::: tip Compact Form in SCALE

Fields with `u64` type are serialized in the [Compact form](https://docs.substrate.io/reference/scale-codec/#fn-1).

:::

### Sub-routing

It is also possible to retrieve the data of a specific `struct` group or variable within it by adding their path to the endpoint address. The sub-routed values are only returned in the JSON format.

**Examples**:

::: code-group

```json [/status]
struct Status {
  "peers": 4,
  "blocks": 5,
  "txs_accepted": 31,
  "txs_rejected": 3,
  "uptime": {
    "secs": 5,
    "nanos": 937000000
  },
  "view_changes": 2,
  "queue_size": 18
}

struct Uptime {
    secs: 5,
    nanos: 937000000
}
```

```json [/status/peers]
4
```

```json [/status/uptime]
{
  "secs": 5,
  "nanos": 937000000
}
```

```json [/status/uptime/secs]
5
```

:::

## Transaction

- **Protocol**: `HTTP`
- **Method**: `POST`
- **Encoding**: `SCALE`
- **Endpoint**: `/transaction`

#### Requests

This endpoint expects the following data:

  - **Body**: [`VersionedSignedTransaction`](/reference/data-model-schema#versionedsignedtransaction)

#### Responses

| Code | Response                                 | Description                                                                        |
| :--: | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| 200  | Transaction Accepted                     | Transaction has been accepted, but is not yet guaranteed to have passed consensus. |
| 400  | Transaction Rejected (Malformed)         | Transaction is rejected due to being malformed.                                    |
| 401  | Transaction Rejected (Improperly signed) | Transaction is rejected due to being improperly signed.                            |
| 500  | Internal Server Error                    | The server encountered an unexpected issue and could not fulfill the request.      |
