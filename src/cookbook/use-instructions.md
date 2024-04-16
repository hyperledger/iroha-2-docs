---
title: "Use Instructions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to use Iroha Special Instructions (ISI)."
  - - meta
    - name: keywords
      content: "Iroha Special Instructions"
---

# How to Use Iroha Special Instructions

Building and submitting an instruction:

```rust
fn use_instruction(
    iroha: &Client,
) {
    let roses = AssetDefinitionId::from_str("rose#wonderland").unwrap();
    let alice = AccountId::from_str("alice@wonderland").unwrap();
    // build an instruction
    let mint_roses_for_alice = Mint::asset_numeric(
        42_u32, 
        AssetId::new(roses, alice)
    );
    // submit the instruction
    iroha.submit(mint_roses_for_alice).unwrap();
}
```