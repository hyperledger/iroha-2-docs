---
title: "Register Accounts | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register accounts in Iroha."
  - - meta
    - name: keywords
      content: "registering accounts"
---

# How to Register an Account

```rust
    //Creating a key pair for a new account
    //The key pair must be given to the new account owner
    let key_pair = KeyPair::generate().unwrap();
    //Now you can execute public|private keys by using functions of key_pair variable
    let public_key = vec![key_pair.public_key().clone()];
    //Creating a NewAccount type
    let new_account = Account::new("alex@wonderland".parse()?, public_key);
    //And finally submit the transaction
    let tx = iroha_client.submit(RegisterExpr::new(new_account))?;
    //Optional. To look at the transaction hash
    print!("{:?}", tx);
```