---
title: "Unregister Asset Definitions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to unregister asset definitions in Iroha."
  - - meta
    - name: keywords
      content: "Iroha asset definition, unregister instruction"
---

# How to Unregister an Asset Definition

```rust
    //First we need to define an asset definition id that we want to unregister
    let asset_definition_id: AssetDefinitionId = AssetDefinitionId::from_str("wondercoins#wonderland").unwrap();
    //Then we need to define an Unregister expression with the asset definition id
    let expression: UnregisterExpr = UnregisterExpr::new(asset_definition_id);
    //And finally we need to send the transaction
    iroha_client.submit_blocking(expression).unwrap();
```
