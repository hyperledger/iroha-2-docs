---
title: "Transfer Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to transfer assets between accounts in Iroha."
  - - meta
    - name: keywords
      content: "transferring assets"
---

# How to Transfer Assets Between Accounts

```rust
fn transfer_numeric_asset(
    iroha: &Client,
) {
    let roses = AssetDefinitionId::from_str("rose#wonderland").unwrap();
    let alice = AccountId::from_str("alice@wonderland").unwrap();
    let mouse = AccountId::from_str("mouse@wonderland").unwrap();
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new(roses, alice),
        13_u32,
        mouse,
    );
    iroha.submit(transfer_roses_from_alice_to_mouse).unwrap();
}
```

```rust
fn transfer_store_asset(
    iroha: &Client,
) {
    let hats = AssetDefinitionId::from_str("hat#outfit").unwrap();
    let alice = AccountId::from_str("alice@outfit").unwrap();
    let mouse = AccountId::from_str("mouse@outfit").unwrap();
    let transfer_hat_from_alice_to_mouse = Transfer::asset_store(
        AssetId::new(hats, alice),
        mouse,
    );
    iroha.submit(transfer_hat_from_alice_to_mouse).unwrap();
}
```
