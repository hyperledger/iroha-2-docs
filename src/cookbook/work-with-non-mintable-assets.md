---
title: "Work with Non-Mintable Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to work with non-mintable assets in Iroha."
  - - meta
    - name: keywords
      content: "non-mintable assets, Iroha assets"
---

# How to Work with Non-Mintable Assets

```rust
fn register_non_mintable_asset(
    iroha: &Client,
) {
    let magical_keys = AssetDefinitionId::from_str("magical_key#wonderland").unwrap();
    // register keys as an asset definition
    let register_keys_as_a_concept = Register::asset_definition(
        AssetDefinition::new(
            magical_keys.clone(),
            AssetValueType::Numeric(NumericSpec::integer()),
        ).mintable_once()
    );
    let alice = "alice@wonderland".parse().unwrap();
    // Alice owns ten keys and cannot mint more
    let initial_keys_of_alice = Asset::new(
        AssetId::new(roses, alice), 
        10_u32
    );
    let register_keys_of_alice = Register::asset(initial_keys_of_alice);
    iroha.submit_all([
        InstructionBox::from(register_keys_as_a_concept),
        InstructionBox::from(register_keys_of_alice)
    ]).unwrap();
}
```

```rust
fn mint_non_mintable_asset(
    iroha: &Client,
) {
    // Alice owns zero keys and can mint once
    let keys_of_alice = "magical_key##alice@wonderland".parse().unwrap();
    let zero_keys_of_alice = Asset::new(
        keys_of_alice.clone(), 
        0_u32
    );
    let register_keys_of_alice = Register::asset(zero_keys_of_alice);
    let mint_keys_for_alice = Mint::asset_numeric(10_u32, keys_of_alice);
    iroha.submit_all([
        InstructionBox::from(register_keys_as_a_concept),
        InstructionBox::from(register_keys_of_alice),
        InstructionBox::from(mint_keys_for_alice),
    ]).unwrap();
}
```