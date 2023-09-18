# Queue Options

Explain Queue module

## `queue.max-transactions-in-queue`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue.

## `queue.max-transactions-in-queue-per-user`

- **Type:** u32
- **Default:** $2^{16} = 65\ 536$

The upper limit of the number of transactions waiting in the queue for
single user. Use this option to apply throttling.

## `queue.transaction-time-to-live`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 24 hours

The transaction will be dropped after this time if it is still in the
queue.

## `queue.future-threshold`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second

The threshold to determine if a transaction has been tampered to have a
future timestamp.
