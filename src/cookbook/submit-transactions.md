---
title: "Submit Transactions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to submit transactions in Iroha."
  - - meta
    - name: keywords
      content: "submitting transactions, Iroha transactions"
---

# How to Submit a Transaction

See [Create Transactions](create-transactions.md) to learn how to create
a `SignedTransaction` used in the examples below.

```rust
fn submit_transaction_do_not_wait_for_approval(
    iroha: &Client,
    transaction: &SignedTransaction
) {
    // If the transaction is rejected, the method panics
    iroha.submit_transaction(transaction).unwrap()
}

fn submit_transaction_and_wait_for_approval(
    iroha: &Client,
    transaction: &SignedTransaction
) {
    // If the transaction is rejected, the method panics
    iroha.submit_transaction_blocking(transaction).unwrap()
}
```