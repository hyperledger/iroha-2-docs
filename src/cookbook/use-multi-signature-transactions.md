---
title: 'Use Multi-Signature Transactions | Cookbook'
head:
  - - meta
    - name: description
      content: 'Learn how to use multi-signature transactions in Iroha.'
  - - meta
    - name: keywords
      content: 'multi-signature transactions'
---

# How to Use Multi-Signature Transactions

The following example shows how to set up a rule that all transactions made
by a specific account should also be signed by an additional key.

## Overview

<!-- maybe some extra introduction info here as well? -->

1. Create an account, set up a second signature rule for it, and register a
   new asset.
2. Submit the transaction signed by the main account key, minting the
   asset.
3. Check that the transaction is not committed by observing the asset.
4. Submit the same transaction signed by the second additional key.
5. Check that the transaction is committed, and the asset is minted.

## Example

1. Let's create an account that would need to have an additional signature
   for its transactions. Let's also create an asset that this account will
   later mint in order to check that the rule about second signature works
   as expected.

   The code below covers the following steps:

   - Create account `mad_hatter` in `wonderland` domain with `key_pair_1`.
   - Assign `SignatureCheckCondition` to the created account. This will
     enforce transactions from `mad_hatter@wonderland` to have an
     additional signature by `key_pair_2`.
   - Register a numeric asset `casomile#wonderland` of type `Quantity` and
     `Infinite` mintability.

::: code-group

```rust [Rust]
let key_pair_1 = KeyPair::generate()?;
let key_pair_2 = KeyPair::generate()?;

let account_id = AccountId::from_str("mad_hatter@wonderland")?;
let asset_definition_id = AssetDefinitionId::from_str("camomile#wonderland")?;

let register_account = RegisterExpr::new(Account::new(
    account_id.clone(),
    [key_pair_1.public_key().clone()],
));
let set_signature_condition = MintExpr::new(
    SignatureCheckCondition::AllAccountSignaturesAnd(
        vec![key_pair_2.public_key().clone()].into(),
    ),
    IdBox::AccountId(account_id.clone()),
);
let register_asset_definition =
    RegisterExpr::new(AssetDefinition::quantity(asset_definition_id.clone()));

let _hash = admin_client.submit_all_blocking({
    let isi: [InstructionExpr; 3] = [
        register_account.into(),
        set_signature_condition.into(),
        register_asset_definition.into(),
    ];
    isi
})?;
```

```ts [TypeScript]
declare const adminClient: Client
declare const torii: ToriiRequirementsForApiHttp

const keyPair1 = crypto.KeyPair.generate()
const keyPair2 = crypto.KeyPair.generate()

const accountId = sugar.accountId('mad_hatter', 'wonderland')
const assetDefinitionId = sugar.assetDefinitionId('camomile', 'wonderland')

const registerAccount = sugar.instruction.register(
  sugar.identifiable.newAccount(accountId, [
    freeScope(() => keyPair1.publicKey().toDataModel()),
  ]),
)
const setSignatureCondition = sugar.instruction.mint(
  datamodel.Value(
    'SignatureCheckCondition',
    datamodel.SignatureCheckCondition(
      'AllAccountSignaturesAnd',
      datamodel.VecPublicKey([
        freeScope(() => keyPair2.publicKey().toDataModel()),
      ]),
    ),
  ),
  datamodel.IdBox('AccountId', accountId),
)
const registerAssetDefinition = sugar.instruction.register(
  sugar.identifiable.newAssetDefinition(
    assetDefinitionId,
    datamodel.AssetValueType('Quantity'),
    { mintable: datamodel.Mintable('Infinitely') },
  ),
)

await adminClient.submitExecutable(
  torii,
  sugar.executable.instructions([
    registerAccount,
    setSignatureCondition,
    registerAssetDefinition,
  ]),
)
```

:::

2. Submit the transaction signed by the main account key, minting the
   asset:

::: code-group

```rust [Rust]
let mut mad_hatter_client = admin_client.clone();
mad_hatter_client.key_pair = key_pair_1;
mad_hatter_client.account_id = account_id.clone();

let quantity: u32 = 42;
let asset_id = AssetId::new(asset_definition_id, account_id.clone());
let mint_asset = MintExpr::new(quantity.to_value(), IdBox::AssetId(asset_id.clone()));

let transaction_1 = {
    let tx =
        mad_hatter_client.build_transaction([mint_asset.clone()], UnlimitedMetadata::new())?;
    mad_hatter_client.sign_transaction(tx)?
};
mad_hatter_client.submit_transaction(&transaction_1)?;
```

```ts [TypeScript]
const madHatterClient = new Client({
  signer: new Signer(accountId, keyPair1),
})

const quantity = 42
const assetId = sugar.assetId(accountId, assetDefinitionId)
const mintAsset = sugar.instruction.mint(
  sugar.value.numericU32(quantity),
  datamodel.IdBox('AssetId', assetId),
)

const transaction = makeSignedTransaction(
  makeTransactionPayload({
    executable: sugar.executable.instructions(mintAsset),
    accountId,
  }),
  madHatterClient.signer,
)

await Torii.submit(torii, transaction)
```

:::

3. Let's query the asset to ensure that the transaction was not committed
   yet, without the second signature:

::: code-group

```rust [Rust]
let error = mad_hatter_client
    .request(client::asset::by_id(asset_id.clone()))
    .expect_err("Asset should not be found");

assert!(matches!(
    error,
    ClientQueryError::Validation(ValidationFail::QueryFailed(QueryExecutionFail::Find(
        FindError::Asset(_)
    )))
));
```

```ts [TypeScript]
const asset = await madHatterClient.requestWithQueryBox(
  torii,
  sugar.find.assetById(assetId),
)

expect(() =>
  asset.as('Err').enum.as('QueryFailed').enum.as('Find').enum.as('Asset'),
).not.toThrow()
```

:::

4. Now let's submit the same transaction, but signed with the second key
   pair:

::: code-group

```rust [Rust]
mad_hatter_client.key_pair = key_pair_2;

// FIXME: not sign tx1, but get original tx from Iroha and sign it
let transaction_2 = mad_hatter_client.sign_transaction(transaction_1)?;
mad_hatter_client.submit_transaction(&transaction_2)?;
```

```ts [TypeScript]
const newSigner = new Signer(accountId, keyPair2)
transaction.enum
  .as('V1')
  .signatures.push(
    signTransaction(transaction.enum.as('V1').payload, newSigner),
  )
await Torii.submit(torii, transaction)
```

:::

5. Let's check the asset to ensure that now the transaction is committed:

::: code-group

```rust [Rust]
let asset: Asset = mad_hatter_client
    .request(client::asset::by_id(asset_id))
    .expect("Asset should be found")
    .try_into()
    .expect("Value should be Asset");

assert_eq!(asset.value, quantity.into());
```

```ts [TypeScript]
const asset = await madHatterClient.requestWithQueryBox(
  torii,
  sugar.find.assetById(assetId),
)

expect(
  asset
    .as('Ok')
    .batch.enum.as('Identifiable')
    .enum.as('Asset')
    .value.enum.as('Quantity'),
).toEqual(quantity)
```

:::

## Find More

You could find full code here: [Rust](https://www.example.com/),
[TypeScript](https://www.example.com/).
