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

Minting roses for Alice:

```rust
fn mint_numeric_asset(
    client: &Client,
    roses: AssetDefinitionId,
    alice: AccountId,
) {
    let mint_roses_for_alice = Mint::asset_numeric(
        42_u32, 
        AssetId::new(roses, alice)
    );
    client.submit(mint_roses_for_alice).unwrap();
}
```

Burning Alice's roses:

```rust
fn burn_numeric_asset(
    client: &Client,
    roses: AssetDefinitionId,
    alice: AccountId,
) {
    let burn_roses_of_alice = Burn::asset_numeric(
        8_u32, 
        AssetId::new(roses, alice)
    );
    client.submit(burn_roses_of_alice).unwrap();
}
```

Transferring Alice's roses to Mouse:

```rust
fn transfer_numeric_asset(
    client: &Client,
    roses: AssetDefinitionId,
    alice: AccountId,
    mouse: AccountId,
) {
    let transfer_roses_from_alice_to_mouse = Transfer::asset_numeric(
        AssetId::new(roses, alice),
        13_u32,
        mouse
    );
    client.submit(transfer_roses_from_alice_to_mouse).unwrap();
}
```