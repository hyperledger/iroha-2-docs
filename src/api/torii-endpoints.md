---
outline: [2, 3]
---

# Torii Endpoints

TODO: write some intro, maybe outline the contents.

## Endpoints for API

TODO: link to config reference, "will use torii.api_address as a base address for endpoints"

### Transaction

- **Protocol**: HTTP
- **Method**: `POST`
- **Endpoint**: `/transaction`
- **Expects**:
  - **Body:** [`VersionedSignedTransaction`](/api/data-model-schema#versionedsignedtransaction) encoded with
    [Parity Scale Codec](#parity-scale-codec)

**Responses**:

| Status | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| 200    | Transaction Accepted (But not guaranteed to have passed consensus yet) |
| 400    | Transaction Rejected (Malformed)                                       |
| 401    | Transaction Rejected (Improperly signed)                               |

### Query

- **Protocol**: HTTP
- **Method**: `POST`
- **Endpoint**: `/query`
- **Expects**:
  - **Body:** [`VersionedSignedQuery`](/api/data-model-schema#versionedsignedquery) encoded with
    [Parity Scale Codec](#parity-scale-codec)
  - **Query parameters:**
    - **`start`:** Optional parameter in queries where results can be indexed. Use to return results from specified
      point. Results are ordered where can be by id which uses rust's
      [PartialOrd](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html#derivable) and
      [Ord](https://doc.rust-lang.org/std/cmp/trait.Ord.html) traits.
    - **`limit`:** Optional parameter in queries where results can be indexed. Use to return specific number of results.
    - **`sort_by_metadata_key`:** Optional parameter in queries. Use to sort results containing metadata with a given
      key.

**Responses**:

| Response         | Status | Body                                                                                    |
| ---------------- | ------ |-----------------------------------------------------------------------------------------|
| Success          | 200    | [`VersionedBatchedResponse<Value>`](/api/data-model-schema#versionedbatchedresponse-value)   |
| Conversion Error | 400    | [`QueryExecutionFail::Conversion(String)`](/api/data-model-schema#queryexecutionfail)   |
| Evaluate Error   | 400    | [`QueryExecutionFail::Evaluate(String)`](/api/data-model-schema#queryexecutionfail)     |
| Signature Error  | 401    | [`QueryExecutionFail::Signature(String)`](/api/data-model-schema#queryexecutionfail)    |
| Permission Error | 403    | [`QueryExecutionFail::Permission(String)`](/api/data-model-schema#queryexecutionfail)   |
| Find Error       | 404    | [`QueryExecutionFail::Find(Box<FindError>)`](/api/data-model-schema#queryexecutionfail) |

#### Account Not Found 404

Whether each prerequisite object was found and [`FindError`](/api/data-model-schema#finderror):

| Domain | Account | [`FindError`](/api/data-model-schema#finderror)                     |
| :----: | :-----: | ------------------------------------------------------------------- |
|   N    |    -    | [`FindError::Domain(DomainId)`](/api/data-model-schema#finderror)   |
|   Y    |    N    | [`FindError::Account(AccountId)`](/api/data-model-schema#finderror) |

#### Asset Not Found 404

Whether each prerequisite object was found and [`FindError`](/api/data-model-schema#finderror):

| Domain | Account | Asset Definition | Asset | [`FindError`](/api/data-model-schema#finderror)                                     |
| :----: | :-----: | :--------------: | :---: | ----------------------------------------------------------------------------------- |
|   N    |    -    |        -         |   -   | [`FindError::Domain(DomainId)`](/api/data-model-schema#finderror)                   |
|   Y    |    N    |        -         |   -   | [`FindError::Account(AccountId)`](/api/data-model-schema#finderror)                 |
|   Y    |    -    |        N         |   -   | [`FindError::AssetDefinition(AssetDefinitionId)`](/api/data-model-schema#finderror) |
|   Y    |    Y    |        Y         |   N   | [`FindError::Asset(AssetId)`](/api/data-model-schema#finderror)                     |

### Events

- **Protocol**: HTTP
- **Protocol Upgrade**: WebSocket
- **Endpoint**: `/events`

#### Pipeline

After handshake, client should send [`EventSubscriptionRequest`](/api/data-model-schema#eventsubscriptionrequest). Then
server sends [`EventMessage`](/api/data-model-schema#eventmessage). Messages are encoded with
[Parity Scale Codec](#parity-scale-codec).

#### Notes

Usually, the client waits for Transaction events.

> TODO: "usually" is cool, but there are other `Event` types. Consider change section name to "Notes about transaction
> events"? NEED HELP

Transaction event statuses can be either `Validating`, `Committed` or `Rejected`.

Transaction statuses proceed from `Validating` to either `Committed` or `Rejected`. However, due to the distributed
nature of the network, some peers might receive events out of order (e.g. `Committed` before `Validating`).

It's possible that some peers in the network are offline for the validation round. If the client connects to them while
they are offline, the peers might not respond with the `Validating` status. But when the offline peers come back online
they will synchronize the blocks. They are then guaranteed to respond with the `Committed` (or `Rejected`) status
depending on the information found in the block.

### Blocks Stream

- **Protocol**: HTTP
- **Protocol Upgrade**:`WebSocket
- **Endpoint**: `/block/stream`

#### Pipeline

Client should send [`BlockSubscriptionRequest`](/api/data-model-schema#blocksubscriptionrequest) to initiate
communication after WebSocket handshake. Then server sends [`BlockMessage`](/api/data-model-schema#blockmessage).
Messages are encoded with [Parity Scale Codec](#parity-scale-codec).

#### Notes

Via this endpoint client first provides the starting block number (i.e. height) in the subscription request. After
sending the confirmation message, server starts streaming all the blocks from the given block number up to the current
block and continues to stream blocks as they are added to the blockchain.

### Get Configuration

::: warning

TODO: Will change as part of the config RFC

:::

- **Protocol**: HTTP
- **Method**: `GET`
- **Endpoint**: `/configuration`

There are 2 possible request bodies and according responses.

#### Get Configuration Value as JSON

- **Request Body:**
  ```json
  "Value"
  ```
- **Responses:**
  - `200 OK`: Configuration value as JSON

#### Get Documentation of a Field

- **Request Body:**
  ```json
  {
    "Docs": ["a", "b", "c"]
  }
  ```
  where "a.b.c" is a path of the field (e.g. `sumeragi.block_time_ms`).
- **Responses**:
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

### Configuration

::: warning

TODO: Will change as part of the config RFC

:::

- **Protocol**: HTTP
- **Method**: `POST`
- **Endpoint**: `/configuration`
- **Expects**:
  - **Body:** One configuration option is currently supported: `LogLevel`. It is set to the log-level in uppercase.
    ```json
    {
      "LogLevel": "WARN"
    }
    ```
    Acceptable values are `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`.
- **Responses**:
  - `200 OK`: Log level has changed successfully. The confirmed new log level is returned in the body.
  - `400 Bad Request`: request body malformed.
  - `500 Internal Server Error`: Request body valid, but changing the log level failed (lock contention).

### Health

- **Protocol**: HTTP
- **Method**: `GET`
- **Endpoint**: `/health`

Responses with `200 OK` and a current status of peer as a JSON string:

```json
"Healthy"
```

### Pending Transactions

TODO: if it is for _internal use only_, remove this endpoint from the docs?

- **Protocol**: HTTP
- **Encoding**: [Parity Scale Codec](#parity-scale-codec)
- **Method**: `GET`
- **Endpoint**: `/pending_transactions`

_Internal use only._ Returns the transactions pending at the moment.

## Endpoints for Status/Metrics

TODO: link to config reference, "will be enabled with torii.telemetry_address" provided

### Status

- **Protocol**: HTTP
- **Method**: `GET`
- **Endpoint**: `/status`

**Responses**:

`200 OK` reports status as JSON:

::: details Sample response

```json5
// Note: while this snippet is JSON5 (for better readability),
//       the actual response is JSON
{
  /**
   * Number of connected peers, except for the reporting peer itself
   */
  peers: 3,
  /**
   * Number of committed blocks (block height)
   */
  blocks: 1,
  /**
   * Total number of accepted transactions
   */
  txs_accepted: 3,
  /**
   * Total number of rejected transactions
   */
  txs_rejected: 0,
  /**
   * Uptime with nanosecond precision since creation of the genesis block
   */
  uptime: {
    secs: 5,
    nanos: 937000000,
  },
  /**
   * Number of view changes in the current round
   */
  view_changes: 0,
}
```

:::

::: warning

Almost all fields are 64-bit integers and should be handled with care in JavaScript (todo: explain the issue with
`serde`). Only the `uptime.nanos` field is a 32-bit integer. See `iroha_telemetry::metrics::Status` (todo: should we
link this struct to anywhere?).

:::

#### Sub-routing

To obtain the value of a specific field, one can append the name of the field to the path, e.g. `status/peers`. This
returns the corresponding JSON value, inline, so strings are quoted, numbers are not and maps are presented as above.

### Metrics

- **Protocol**: HTTP
- **Method**: `GET`
- **Endpoint**: `/metrics`

**Responses**:

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

### API Version

- **Protocol**: HTTP
- **Method**: `GET`
- **Endpoint**: `/api_version`

**Responses**:

`200 OK`: The current version of API used by Iroha returned as a JSON string. Grabbed from the genesis block's version,
so at least a minimal subnet of 4 peers should be running and the genesis be submitted at the time of request.

```json
"1"
```

## Parity Scale Codec

For more information on codec check [Substrate Dev Hub](https://docs.substrate.io/reference/scale-codec/) and codec's
[GitHub repository](https://github.com/paritytech/parity-scale-codec).

TODO: link to our own article about SCALE (https://github.com/hyperledger/iroha-2-docs/issues/367)

## Reference Iroha Client Implementation

TODO: should we put link to the `iroha_client` crate?
