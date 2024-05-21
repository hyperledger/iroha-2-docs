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
    // panics if the transaction is invalid (cannot be submitted)
    let _hash = iroha.submit_transaction(transaction).unwrap();
    // transaction may or may not have been committed or rejected
}

fn submit_transaction_and_wait_for_approval(
    iroha: &Client,
    transaction: &SignedTransaction
) {
    // panics if the transaction is invalid or rejected
    let _hash = iroha.submit_transaction_blocking(transaction).unwrap();
    // transaction has been committed
}
```