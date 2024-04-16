---
title: "Work with Numeric Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to work with numeric assets in Iroha."
  - - meta
    - name: keywords
      content: "Iroha assets, numeric assets"
---

# How to Work with Numeric Assets

Registering Alice's roses:

```rust
fn register_numeric_asset(
    iroha: &Client,
) {
    let roses = AssetDefinitionId::from_str("rose#wonderland").unwrap();
    // register roses as an asset definition
    let register_roses_as_a_concept = Register::asset_definition(
        AssetDefinition::new(
            roses.clone(),
            // for the sake of the example, allow whole roses only
            AssetValueType::Numeric(NumericSpec::integer()),
        )
    );
    let alice = "alice@wonderland".parse().unwrap();
    let roses_of_alice = AssetId::new(roses, alice);
    let initial_roses_of_alice = Asset::new(roses_of_alice, 0_u32);
    // register zero roses as Alice's asset
    let register_roses_of_alice = Register::asset(initial_roses_of_alice);
    iroha.submit_all([
        InstructionBox::from(register_roses_as_a_concept), 
        InstructionBox::from(register_roses_of_alice)
    ]).unwrap();
}
```

Minting roses for Alice:

```rust
fn mint_numeric_asset(
    iroha: &Client,
) {
    let mint_roses_for_alice = Mint::asset_numeric(
        42_u32, 
        "rose##alice@wonderland".parse().unwrap()
    );
    iroha.submit(mint_roses_for_alice).unwrap();
}
```

Burning Alice's roses:

```rust
fn burn_numeric_asset(
    iroha: &Client,
) {
    let burn_roses_of_alice = Burn::asset_numeric(
        8_u32,
        AssetId::from_str("rose##alice@wonderland").unwrap()
    );
    iroha.submit(burn_roses_of_alice).unwrap();
}
```

Transferring Alice's roses to Mouse:

```rust
fn transfer_numeric_asset(
    iroha: &Client,
) {
    let roses = AssetDefinitionId::from_str("rose#wonderland").unwrap();
    let alice = AccountId::from_str("alice@wonderland").unwrap();
    let mouse = AccountId::from_str("mouse@wonderland").unwrap();
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new(roses, alice),
        13_u32,
        mouse,
    );
    iroha.submit(transfer_roses_from_alice_to_mouse).unwrap();
}
```