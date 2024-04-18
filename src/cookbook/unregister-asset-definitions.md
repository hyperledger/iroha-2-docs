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
fn undefine_asset(
    iroha: &Client,
) {
    let hats = AssetDefinitionId::from_str("hat#outfit").unwrap();
    iroha.submit(Unregister::asset_definition(hats)).unwrap();
}
```