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

```rust
    //Precondition: The asset definition was registered
    // First we need to define the asset definition id
    let asset_definition_id = AssetDefinitionId::from_str("coolAsset#wonderland").unwrap();

    //Then we need to create an assetId object
    //The AssetId is a complex object which consists of asset definition id and account id
    let asset_id: AssetId = AssetId::new(asset_definition_id, AccountId::from_str("alice@wonderland").unwrap());

    //Now we need to define the asset quantity regarding to the asset's value type
    let asset_quantity: Fixed = Fixed::from_str("11").unwrap();

    //And finally we need to send the transaction
    iroha_client.submit_blocking(MintExpr::new(asset_quantity, asset_id)).unwrap();
```