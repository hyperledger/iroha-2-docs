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
            // for the sake of the example,
            // allow dividing roses into tenths
            AssetValueType::Numeric(NumericSpec::fractional(1)),
        )
    );
    let alice = "alice@wonderland".parse().unwrap();
    let roses_of_alice = AssetId::new(roses, alice);
    let initial_roses_of_alice = Asset::new(roses_of_alice, Numeric::ZERO);
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
    // mint twelve and a half roses
    let mint_roses_for_alice = Mint::asset_numeric(
        numeric!(12.5), 
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
    // burn three roses
    let burn_roses_of_alice = Burn::asset_numeric(
        numeric!(3),
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
    // transfer ten roses and a tenth of a rose
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new(roses, alice),
        numeric!(10.1),
        mouse,
    );
    iroha.submit(transfer_roses_from_alice_to_mouse).unwrap();
}
```

Check that Alice has a whole number of roses:

```rust
fn query_numeric_asset(
    iroha: &Client,
) {
    let roses = AssetDefinitionId::from_str("rose#wonderland").unwrap();
    let alice = AccountId::from_str("alice@wonderland").unwrap();
    let roses_of_alice = AssetId::new(roses, alice);
    let total_roses_of_alice = iroha
        .request(FindAssetQuantityById::new(roses_of_alice))
        .unwrap();
    match NumericSpec::integer().check(total_roses_of_alice) {
        Ok(_) => println!("Alice has a whole number of roses"),
        Err(_) => println!("Alice has a fractional number of roses"),
    }
}
```