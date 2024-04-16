---
title: "Work with Store Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to work with Store assets in Iroha."
  - - meta
    - name: keywords
      content: "Iroha assets, Store assets"
---

# How to Work with Store Assets

While numeric assets represent quantities, store assets represent 
arbitrary key-value tables.

```rust
fn define_store_asset(
    iroha: &Client,
) {
    let hats = AssetDefinitionId::from_str("hat#outfit").unwrap();
    let hats_as_a_concept = AssetDefinition::store(hats);
    iroha.submit(Register::asset_definition(hats_as_a_concept)).unwrap();
}
```

```rust
fn set_key_value_pair(
    iroha: &Client,
) {
    let hat_of_alice = AssetId::from_str("hat##alice@outfit").unwrap();
    let color = Name::from_str("color").unwrap();
    iroha.submit(SetKeyValue::asset(
        hat_of_alice,
        color,
        "red".to_owned()
    )).unwrap();
}
```

```rust
fn unset_key_value_pair(
    iroha: &Client,
) {
    let hat_of_alice = AssetId::from_str("hat##alice@outfit").unwrap();
    let color = Name::from_str("color").unwrap();
    iroha.submit(RemoveKeyValue::asset(hats, color)).unwrap();
}
```