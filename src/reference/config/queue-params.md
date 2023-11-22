# Queue Parameters

TODO Explain Queue module. The queue holds incoming transactions. From time to time, Sumeragi fetches them in order to
create a block.

## `queue.future_threshold`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

The threshold to determine if a transaction has been tampered with to have a future timestamp.

TODO: explain that _timestamp_ is the value specified in
[`TransactionPayload`'s `creation_time_ms` field](/reference/data-model-schema#transactionpayload).

**Example:**

```toml
[queue]
future_threshold = "1s"
```


## `queue.max_transactions_in_queue`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue.

**Example:**

```toml
[queue]
max_transactions_in_queue = 65_536
```

## `queue.max_transactions_in_queue_per_user`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue for a single user. Use this option to apply
throttling.

**Example:**

```toml
[queue]
max_transactions_in_queue_per_user = 65_536
```

## `queue.transaction_time_to_live`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 24 hours

The transaction will be dropped after this time if it is still in the queue.

TODO: there is also `TransactionPayload`'s `time_to_live` parameter. We should probably say here that configuration
parameter has higher priority. Name it `queue.max_transaction_time_to_live`?

**Example:**

```toml
[queue]
transaction_time_to_live = "24h"
```

