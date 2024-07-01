---
title: "Mint Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to mint assets in Iroha."
  - - meta
    - name: keywords
      content: "minting assets, mintable assets"
---

# How to Mint an Asset

Only numeric assets can be minted – infinitely, or only once.

```rust
fn mint_numeric_asset(iroha: &Client) {
    let roses = "rose#wonderland".parse::<AssetDefinitionId>().unwrap();
    let roses_definition = iroha
        .request(FindAssetDefinitionById::new(roses.clone()))
        .unwrap();
    match roses_definition.mintable {
        Mintable::Infinitely => println!("This code will succeed indefinitely"),
        Mintable::Once => println!("This code will succeed only once"),
        Mintable::Not => println!("This code will fail"),
    }
    let alice = "alice@wonderland".parse::<AccountId>().unwrap();
    let roses_of_alice = AssetId::new(roses, alice);
    let quantity = numeric!(42);
    let mint_roses_of_alice = Mint::asset_numeric(quantity, roses_of_alice);
    iroha.submit(mint_roses_of_alice).unwrap();
}
```