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
fn define_store_asset(
    iroha: &Client,
) {
    let hats = "hat#outfit".parse::<AssetDefinitionId>().unwrap();
    let hats_as_a_concept = AssetDefinition::store(hats);
    iroha.submit(Register::asset_definition(hats_as_a_concept)).unwrap();
}
```

```rust
fn define_numeric_asset(iroha: &Client) {
    let define_roses = Register::asset_definition(
        AssetDefinition::new(
            "rose#wonderland".parse().unwrap(),
            // allow only whole values
            AssetValueType::Numeric(NumericSpec::integer()),
        )
    );
    let define_coins = Register::asset_definition(
        AssetDefinition::new(
            "coin#wonderland".parse().unwrap(),
            // allow fractional values with two decimal places
            AssetValueType::Numeric(NumericSpec::fractional(2)),
        )
    );    
    let define_gold = Register::asset_definition(
        // allow arbitrary numeric values
        AssetDefinition::numeric("gold#wonderland".parse().unwrap())
    );
    let instructions: [RegisterBox; _] = [
        define_roses.into(),
        define_coins.into(),
        define_gold.into(),
    ];
    iroha.submit_all(instructions).unwrap();
}
```