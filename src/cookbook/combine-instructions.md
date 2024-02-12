---
title: "Combine Instructions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to combine different Iroha Special Instructions (ISI) via expressions."
  - - meta
    - name: keywords
      content: "Iroha Special Instructions, expressions"
---

# How to Combine Iroha Special Instructions

```rust
// Instructions should be unified to a single type 'InstructionExpr'

    // Register account
    let register_account_instruction: InstructionExpr = {
        let key_pair = KeyPair::generate().unwrap();
        RegisterExpr::new(Account::new(
            AccountId::from_str("roman@wonderland").unwrap(),
            vec![key_pair.public_key().clone()],
        ))
        .into()
    };
    // Register asset definition
    let register_asset_definition_instruction: InstructionExpr = RegisterExpr::new(
        AssetDefinition::quantity(AssetDefinitionId::from_str("romancoin#wonderland").unwrap()),
    )
    .into();
    // Mint asset
    let mint_asset_to_roman: InstructionExpr = MintExpr::new(
        51_u32,
        AssetId::from_str("romancoin#wonderland#roman@wonderland").unwrap(),
    )
    .into();
    // Transfer asset
    let transfer_asset_to_alina: InstructionExpr = TransferExpr::new(
        AssetId::from_str("romancoin#wonderland#roman@wonderland").unwrap(),
        21_u32,
        AccountId::from_str("alina@wonderland").unwrap(),
    )
    .into();

    // Bind instructions into collection
    let instructions = vec![
        register_account_instruction,
        register_asset_definition_instruction,
        mint_asset_to_roman,
        transfer_asset_to_alina,
    ];
```