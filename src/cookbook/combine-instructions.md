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

In order to combine instructions of different types in one collection,
you need some sort of polymorphism. We provide this via enum wrappers
for each instruction type (e.g. `RegisterBox`, `MintBox`, and others), 
as well as the most general `InstructionBox` type. 

Any instruction can be converted to the needed wrapper if compatible, 
no allocations involved (despite what the `*Box` suffix might suggest).

```rust
fn combine_isi(iroha: &Client) {
    let alice = "alice@wonderland".parse::<AccountId>().unwrap();
    let register_alice = {
        let (public_key, _private_key) = KeyPair::random().into_parts();
        Register::account(Account::new(alice.clone(), public_key))
    };
    let roses = "rose#wonderland".parse::<AssetDefinitionId>().unwrap();
    let define_roses = Register::asset_definition(
        AssetDefinition::numeric(roses.clone())
    );
    let roses_of_alice = AssetId::new(roses.clone(), alice.clone());
    let mint_roses_for_alice = Mint::asset_numeric(
        numeric!(20),
        roses_of_alice.clone()
    );
    let mouse = "mouse@wonderland".parse::<AccountId>().unwrap();
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        roses_of_alice,
        numeric!(10),
        mouse,
    );
    let instructions: [InstructionBox; _] = [
        register_alice.into(),
        define_roses.into(),
        mint_roses_for_alice.into(),
        transfer_roses_from_alice_to_mouse.into(),
    ];
    iroha.submit_all(instructions).unwrap();
}
```