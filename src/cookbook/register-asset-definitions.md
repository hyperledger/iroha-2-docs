---
title: "Register Asset Definitions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register asset definitions in Iroha."
  - - meta
    - name: keywords
      content: "asset definitions, registering asset definitions"
---

# How to Register an Asset Definition

```rust
//First we need to create the asset id
let asset_definition_id = AssetDefinitionId::from_str("coolAsset#wonderland").unwrap();

//Then we need to define the asset value type
//There are only 4 asset value types and they are defined in the AssetValueType struct
let asset_value_type: AssetValueType = AssetValueType::Fixed;

//Then we need to create an asset definition object
let asset_definition = AssetDefinition::new(asset_definition_id, asset_value_type);

//And finally we need to send the transaction
iroha_client.submit(RegisterExpr::new(asset_definition)).unwrap();
```