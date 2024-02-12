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

```rust
    //Note:
    // Only domain owner or account with appropriate permission token can unregister another account
    //First we need to define an account id that we want to unregister
    let account_id = AccountId::from_str("artem@disneyland").unwrap();
    //Then we need to define an Unregister expression
    let expression = UnregisterExpr::new(account_id);
    //And finally we need to send the transaction
    iroha_client.submit_blocking(expression).unwrap();
```