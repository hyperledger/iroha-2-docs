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
    let hats = "hat#outfit".parse::<AssetDefinitionId>().unwrap();
    let hats_as_a_concept = AssetDefinition::store(hats);
    iroha.submit(Register::asset_definition(hats_as_a_concept)).unwrap();
}
```

```rust
fn set_key_value_pair(
    iroha: &Client,
) {
    let hat_of_alice = "hat##alice@outfit".parse::<AssetId>().unwrap();
    let color = "color".parse::<Name>().unwrap();
    iroha.submit(SetKeyValue::asset(
        hat_of_alice,
        color,
        "red".to_owned()
    )).unwrap();
}
```

```rust
fn read_key_value_pair(
    iroha: &Client,
) {
    let hat_of_alice = "hat##alice@outfit".parse::<AssetId>().unwrap();
    let color = "color".parse::<Name>().unwrap();
    // assume the color has been set to "red"
    let red = iroha.request(FindAssetKeyValueByIdAndKey::new(
        hat_of_alice, 
        color
    )).unwrap();
    assert_eq!(red, MetadataValueBox::String("red".to_owned()));
}
```

```rust
fn unset_key_value_pair(
    iroha: &Client,
) {
    let hat_of_alice = "hat##alice@outfit".parse::<AssetId>().unwrap();
    let color = "color".parse::<Name>().unwrap();
    iroha.submit(RemoveKeyValue::asset(hats, color)).unwrap();
}
```