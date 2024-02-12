---
title: "Unregister Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to unregister assets in Iroha."
  - - meta
    - name: keywords
      content: "Iroha assets, unregister instruction"
---

# How to Unregister an Asset

```rust
    //First we need to define an account id which has an asset that we want to unregister
    let account_id = AccountId::from_str("alina@wonderland").unwrap();
    //Then we need to define an asset definition id that we want to unregister
    let asset_definition_id: AssetDefinitionId = AssetDefinitionId::from_str("romancoin#wonderland").unwrap();
    //After, define the asset id as a new object that consists of asset definition id and account id
    let asset_id: AssetId = AssetId::new(asset_definition_id, account_id);
    // Define an Unregister expression with the asset id
    let expression: UnregisterExpr = UnregisterExpr::new(asset_id);
    //And finally we need to send the transaction
    iroha_client.submit_blocking(expression).unwrap()
```