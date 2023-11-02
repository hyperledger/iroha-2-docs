# Torii Endpoints

<!-- TODO: write some intro, maybe outline the contents. -->

## API Version

- **Protocol:** HTTP
- **Method:** `GET`
- **Endpoint:** `/api_version`

**Responses:**

`200 OK`: The current version of API used by Iroha returned as a JSON string. Grabbed from the genesis block's version,
so at least a minimal subnet of 4 peers should be running and the genesis be submitted at the time of request.

```json
"1"
```

## Blocks Stream

- **Protocol:** HTTP
- **Protocol Upgrade:**`WebSocket
- **Endpoint:** `/block/stream`

The client should send a [`BlockSubscriptionRequest`](/reference/data-model-schema#blocksubscriptionrequest) to initiate
communication after the WebSocket handshake. Then the server sends a
[`BlockMessage`](/reference/data-model-schema#blockmessage). Messages are SCALE-encoded[^1].

Via this endpoint, the client first provides the starting block number (i.e. height) in the subscription request. After
sending the confirmation message, the server starts streaming all the blocks from the given block number up to the
current block and continues to stream blocks as they are added to the blockchain.

## Events

- **Protocol:** HTTP
- **Protocol Upgrade:** WebSocket
- **Endpoint:** `/events`

After a handshake, the client should send an
[`EventSubscriptionRequest`](/reference/data-model-schema#eventsubscriptionrequest). Then the server sends an
[`EventMessage`](/reference/data-model-schema#eventmessage). Messages are SCALE-encoded[^1].

### Transaction Events

Transaction event statuses can be either `Validating`, `Committed` or `Rejected`.

Transaction statuses proceed from `Validating` to either `Committed` or `Rejected`. However, due to the distributed
nature of the network, some peers might receive events out of order (e.g. `Committed` before `Validating`).

Some peers in the network may be offline for the validation round. If the client connects to them while they are
offline, the peers might not respond with the `Validating` status. But when the offline peers come back online they will
synchronize the blocks. They are then guaranteed to respond with the `Committed` (or `Rejected`) status depending on the
information found in the block.

## Health

- **Protocol:** HTTP
- **Method:** `GET`
- **Endpoint:** `/health`

Responses with `200 OK` and a current status of peer as a JSON string:

```json
"Healthy"
```

## Metrics

- **Protocol:** HTTP
- **Method:** `GET`
- **Endpoint:** `/metrics`

**Responses:**

`200 OK` reports 8 of 10 metrics:

::: details Sample Prometheus metrics

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

Learn [how to use metrics](/guide/advanced/metrics).

## Query

- **Protocol:** HTTP
- **Method:** `POST`
- **Endpoint:** `/query`
- **Expects:**
  - **Body:** SCALE-encoded[^1] [`VersionedSignedQuery`](/reference/data-model-schema#versionedsignedquery)
  - **Query parameters:**
    - **`start`:** An optional parameter in queries where results can be indexed. Use to return results from a specified
      point. Results are ordered by id, which uses Rust's
      [PartialOrd](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html#derivable) and
      [Ord](https://doc.rust-lang.org/std/cmp/trait.Ord.html) traits.
    - **`limit`:** An optional parameter in queries where results can be indexed. Use to return a specific number of
      results.
    - **`sort_by_metadata_key`:** An optional parameter in queries. Use to sort results containing metadata with a given
      key.

**Responses:**

| Response         | Status | Body                                                                                       |
| ---------------- | ------ | ------------------------------------------------------------------------------------------ |
| Success          | 200    | [`VersionedBatchedResponse<Value>`](/reference/data-model-schema#versionedbatchedresponse-value) |
| Conversion Error | 400    | [`QueryExecutionFail::Conversion(String)`](/reference/data-model-schema#queryexecutionfail)      |
| Evaluate Error   | 400    | [`QueryExecutionFail::Evaluate(String)`](/reference/data-model-schema#queryexecutionfail)        |
| Signature Error  | 401    | [`QueryExecutionFail::Signature(String)`](/reference/data-model-schema#queryexecutionfail)       |
| Permission Error | 403    | [`QueryExecutionFail::Permission(String)`](/reference/data-model-schema#queryexecutionfail)      |
| Find Error       | 404    | [`QueryExecutionFail::Find(FindError)`](/reference/data-model-schema#queryexecutionfail)         |

### Account Not Found 404

Whether each prerequisite object was found and [`FindError`](/reference/data-model-schema#finderror):

| Domain | Account | [`FindError`](/reference/data-model-schema#finderror)                     |
| :----: | :-----: | ------------------------------------------------------------------- |
|   N    |    -    | [`FindError::Domain(DomainId)`](/reference/data-model-schema#finderror)   |
|   Y    |    N    | [`FindError::Account(AccountId)`](/reference/data-model-schema#finderror) |

### Asset Not Found 404

Whether each prerequisite object was found and [`FindError`](/reference/data-model-schema#finderror):

| Domain | Account | Asset Definition | Asset | [`FindError`](/reference/data-model-schema#finderror)                                     |
| :----: | :-----: | :--------------: | :---: | ----------------------------------------------------------------------------------- |
|   N    |    -    |        -         |   -   | [`FindError::Domain(DomainId)`](/reference/data-model-schema#finderror)                   |
|   Y    |    N    |        -         |   -   | [`FindError::Account(AccountId)`](/reference/data-model-schema#finderror)                 |
|   Y    |    -    |        N         |   -   | [`FindError::AssetDefinition(AssetDefinitionId)`](/reference/data-model-schema#finderror) |
|   Y    |    Y    |        Y         |   N   | [`FindError::Asset(AssetId)`](/reference/data-model-schema#finderror)                     |

## Status

- **Protocol:** HTTP
- **Method:** `GET`
- **Endpoint:** `/status`
- **Expects:** an optional `Accept: application/x-parity-scale` request header to encode response with SCALE[^1].
  Otherwise, will fall back to `application/json`.
- **Responses**: with `Content-Type` set either to `application/json` or `application/x-parity-scale`, and an
  accordingly encoded response body.

Response body is of the following `Status` structure:

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


::: warning JSON Precision Lost

Almost all fields in the `Status` structure are 64-bit integers, and they are encoded in JSON as-is. Since native JSON's
number type according to the specification effectively is `f64`, the precision might be lost on deserialization, for
example, in
[JavaScript's `JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
For more details, see related [issue](https://github.com/hyperledger/iroha/issues/3964).

:::

::: tip Compact Form in SCALE

Fields with type `u64` serialized in the [Compact form](https://docs.substrate.io/reference/scale-codec/#fn-1).

:::

::: details Sample responses

These samples represent the same data:

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

### Sub-routing

To obtain the value of a specific field, one can append the name of the field to the path, e.g. `/status/peers`. This
returns the corresponding JSON value.

::: code-group

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

- **Protocol:** HTTP
- **Method:** `POST`
- **Endpoint:** `/transaction`
- **Expects:**
  - **Body:** SCALE-encoded[^1] [`VersionedSignedTransaction`](/reference/data-model-schema#versionedsignedtransaction)

**Responses:**

| Status | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| 200    | Transaction Accepted (But not guaranteed to have passed consensus yet) |
| 400    | Transaction Rejected (Malformed)                                       |
| 401    | Transaction Rejected (Improperly signed)                               |

[^1]:
    For more information on Parity SCALE Codec check
    [Substrate Dev Hub](https://docs.substrate.io/reference/scale-codec/) and codec's
    [GitHub repository](https://github.com/paritytech/parity-scale-codec).

    <!--TODO: link to our own article about SCALE https://github.com/hyperledger/iroha-2-docs/issues/367-->

<!-- TODO: edit these endpoints when the decision is made about them (according to the config rfc)

## Get Configuration

- **Protocol:** HTTP
- **Method:** `GET`
- **Endpoint:** `/configuration`

There are 2 possible request bodies and according responses.

### Get Configuration Value as JSON

- **Request Body:**
  ```json
  "Value"
  ```
- **Responses:**
  - `200 OK`: Configuration value as JSON

### Get Documentation of a Field

- **Request Body:**
  ```json
  {
    "Docs": ["a", "b", "c"]
  }
  ```
  where "a.b.c" is a path of the field (e.g. `sumeragi.block_time_ms`).
- **Responses:**
  - `200 OK`: Field was found and either doc or value is returned in json body.
  - `404 Not Found`: Field wasn't found

::: tip

If the requested field has more fields inside of it, then all the documentation for its inner members is returned as
well. Here is an example for getting a field `a.b.c`:

**Example:** getting top-level documentation for `Torii` and all the fields within:

```bash
curl -X GET -H 'content-type: application/json' http://127.0.0.1:8080/configuration \
    -d '{"Docs" : ["torii"]} ' -i
```

:::

## Configuration

::: warning

TODO: Will change as part of the config RFC

:::

- **Protocol:** HTTP
- **Method:** `POST`
- **Endpoint:** `/configuration`
- **Expects:**
  - **Body:** One configuration option is currently supported: `LogLevel`. It is set to the log-level in uppercase.
    ```json
    {
      "LogLevel": "WARN"
    }
    ```
    Acceptable values are `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`.
- **Responses:**
  - `200 OK`: Log level has changed successfully. The confirmed new log level is returned in the body.
  - `400 Bad Request`: request body malformed.
  - `500 Internal Server Error`: Request body valid, but changing the log level failed (lock contention).

-->
