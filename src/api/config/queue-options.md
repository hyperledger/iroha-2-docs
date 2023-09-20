# Queue Options

Explain Queue module

## `queue.max_transactions_in_queue`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue.

## `queue.max_transactions_in_queue_per_user`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue for
single user. Use this option to apply throttling.

## `queue.transaction_time_to_live`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 24 hours

The transaction will be dropped after this time if it is still in the
queue.

## `queue.future_threshold`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

The threshold to determine if a transaction has been tampered to have a
future timestamp.
