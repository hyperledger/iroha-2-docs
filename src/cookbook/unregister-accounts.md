---
title: "Unregister Accounts | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to unregister accounts in Iroha."
  - - meta
    - name: keywords
      content: "Iroha accounts, unregister instruction"
---

# How to Unregister Accounts

Only domain owners and accounts with an appropriate permission token 
can unregister another account.

```rust
fn unregister_account(iroha: &Client) {
    let alice = "alice@wonderland".parse::<AccountId>().unwrap();
    let unregister_alice = Unregister::account(alice);
    iroha.submit(unregister_alice).unwrap();
}
```