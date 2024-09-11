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
fn register_account(iroha: &Client) {
    let alice = "alice@wonderland".parse::<AccountId>().unwrap();
    let (public_key, _private_key) = KeyPair::random().into_parts();
    // Keep your private key secret, 
    // and use the public key to create an account
    let register_alice = Register::account(
        Account::new(alice, public_key)
    );
    iroha.submit(register_alice).unwrap();
}
```