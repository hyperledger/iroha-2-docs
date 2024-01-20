---
title: "Register Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register assets in Iroha."
  - - meta
    - name: keywords
      content: "registering assets"
---

# How to Register an Asset

```rust
    //Precondition: The asset definition was registered
    // First we need to define the asset definition id
    let asset_definition_id = AssetDefinitionId::from_str("coolAsset#wonderland").unwrap();

    //Then we need to create an assetId object
    //The AssetId is a complex object which consists of asset definition id and account id
    //And the Asset also is a complex object which consists of asset id and its quantity
    let asset_id: AssetId = AssetId::new(asset_definition_id, AccountId::from_str("alice@wonderland").unwrap());
    let asset: Asset = Asset::new(asset_id, Fixed::from_str("33").unwrap());

    //And finally we need to send the transaction
    iroha_client.submit_blocking(RegisterExpr::new(asset)).unwrap();
```