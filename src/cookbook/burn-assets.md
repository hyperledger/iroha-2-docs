---
title: "Burn Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to burn assets."
  - - meta
    - name: keywords
      content: "mintable assets, burning assets"
---

# How to Burn an Asset

Only numeric assets can be burned.

```rust
fn burn_numeric_asset(iroha: &Client) {
    let roses = "rose#wonderland".parse::<AssetDefinitionId>().unwrap();
    let alice = "alice@wonderland".parse::<AccountId>().unwrap();
    let roses_of_alice = AssetId::new(roses, alice);
    let quantity = numeric!(42);
    let burn_roses_of_alice = Burn::asset_numeric(quantity, roses_of_alice);
    iroha.submit(burn_roses_of_alice).unwrap();
}
```