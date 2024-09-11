---
title: "Create Transactions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to create transactions in Iroha."
  - - meta
    - name: keywords
      content: "transactions"
---

# How to Create a Transaction

```rust
fn create_transaction(iroha: &Client) -> SignedTransaction {
    // Prepare the instructions you want to execute
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
    let register_roses_of_alice = Register::asset(
        Asset::new(roses_of_alice, numeric!(100))
    );
    
    // Combine the instructions 
    let instructions: [InstructionBox; _] = [
        register_alice.into(),
        define_roses.into(),
        register_roses_of_alice.into(),
    ];

    // Build a transaction with the prepared instructions and empty metadata
    // on behalf of the current account configured with the client
    iroha.build_transaction(
        instructions, 
        UnlimitedMetadata::default()
    )
}
```

See [Submit Transactions](submit-transactions.md) to learn how to submit 
the resulting `SignedTransaction`.