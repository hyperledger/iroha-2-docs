---
title: "Transfer Groups of Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to transfer a group of assets."
  - - meta
    - name: keywords
      content: "transferring assets"
---

# How to Transfer a Group of Assets

Transferring multiple assets atomically involves combining multiple
Transfer instructions in a single transaction.

```rust
fn transfer_group_of_assets(iroha: &Client) {
    let alice = "alice@wonderland".parse().unwrap();
    let mouse = "mouse@wonderland".parse().unwrap();
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new("rose#wonderland".parse().unwrap(), alice.clone()),
        numeric!(1),
        mouse.clone(),
    );
    let transfer_coins_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new("coin#wonderland".parse().unwrap(), alice.clone()),
        numeric!(0.99),
        mouse.clone(),
    );
    let transfer_hat_from_alice_to_mouse = Transfer::asset_store(
        AssetId::new("hat#wonderland".parse().unwrap(), alice),
        mouse,
    );
    let transfers: [TransferBox; _] = [
        transfer_roses_from_alice_to_mouse.into(),
        transfer_coins_from_alice_to_mouse.into(),
        transfer_hat_from_alice_to_mouse.into(),
    ];
    iroha.submit_all(transfers).unwrap();
}
```
<!-- related issue: https://github.com/hyperledger/iroha-2-docs/issues/369 -->