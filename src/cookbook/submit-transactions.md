---
title: "Submit Transactions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to submit transactions in Iroha."
  - - meta
    - name: keywords
      content: "submitting transactions, Iroha transactions"
---

# How to Submit a Transaction

```rust
//Precondition: the Client variable must be initialized
    
//First we need to build an instruction expression that we want to submit
//The instruction expression structures have a self-explanatory name
//and you can easily understand what each of them does.
//As an example:
//* BurnExp - burns asset quantity
//* MintExpr - mints asset quantity
//* RegisterExpr - registers any Registrable object like
//** Account, Asset, Asset definition, Trigger etc.
//As an example we will take the MintExpr

let asset_definition_id = AssetDefinitionId::from_str("coolAsset#wonderland").unwrap();
let asset_id: AssetId = AssetId::new(asset_definition_id, AccountId::from_str("alice@wonderland").unwrap());
let asset_quantity: Fixed = Fixed::from_str("7").unwrap();

let some_expression = MintExpr::new(asset_quantity, asset_id);

//The client module in the iroha_client crate has 2 methods for the transaction submission
//* submit() - sends a transaction without waiting for approval
//* submit_blocking() - sends a transaction and waits for approving.
//If the transaction will be rejected, the method will panic
iroha_client.submit_blocking(some_expression).unwrap();
```