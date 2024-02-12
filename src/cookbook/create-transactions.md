---
title: "Create transactions | Cookbook"
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
    /* 
    Define the Iroha 2 client.
    Note: 
    The author uses his custom get_client() function.
    To initialize Client with default methods, please look in the Guide section
    */
    let iroha_client: Client = get_client();
    // Define an account on behalf of which a transaction will be build
    let account_id: AccountId = "alice@wonderland".parse().unwrap();
    // Define the set of instructions (Can be one or many)
    let register_account_instruction = {
        let key_pair = KeyPair::generate().unwrap();
        RegisterExpr::new(Account::new(
            AccountId::from_str("alina@wonderland").unwrap(),
            vec![key_pair.public_key().clone()],
        ))
    };
    let register_asset_definition_instruction = RegisterExpr::new(AssetDefinition::quantity(
        AssetDefinitionId::from_str("wondercoins#wonderland").unwrap(),
    ));
    let register_asset_id_instruction = RegisterExpr::new(Asset::new(
        AssetId::new(
            AssetDefinitionId::from_str("wondercoins#wonderland").unwrap(),
            AccountId::from_str("alina@wonderland").unwrap(),
        ),
        11_u32,
    ));
    // Bind instruction into collection
    let instructions = vec![
        register_account_instruction,
        register_asset_definition_instruction,
        register_asset_id_instruction,
    ];
    /* 
    Initialize a transaction builder and inserts:
        * The transaction owner's account id
        * The set of instructions
        * The default metadata 
     */
    let tx_builder = TransactionBuilder::new(account_id.clone())
        .with_instructions(instructions)
        .with_metadata(UnlimitedMetadata::default());
    
    // Sign the transaction by transaction owner's key pair
    let signed_transaction = iroha_client.sign_transaction(tx_builder).unwrap();
    
    // Send the transaction to the Iroha 2
    iroha_client
        .submit_transaction(&signed_transaction)
        .unwrap();
```