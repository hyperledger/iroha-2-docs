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

We will create an account with a key and set a rule that all transactions
made by this account should be also signed by an additional key. Then we
will perform a transaction itself, in two stages: first will be signed and
submitted with the main account key, and then the same transaction will be
submitted with an additional signature by the second key. To check if
everything works, we will also create and asset and the multi-signature
transaction will mint that asset.

So, our first transaction will:

- Create account `mad_hatter` in `wonderland` domain with `key1`
- Assign `SignatureCheckCondition` to it, which will enforce transactions
  from `mad_hatter@wonderland` to have an additional `key2`
- Register a numeric asset `casomile#wonderland` of type `Quantity` and
  infinite mintability.

::: code-group

```rust [Rust]
let alice_id = AccountId::from_str("alice@wonderland")?;
let alice_key_pair = get_key_pair();
let key_pair_2 = KeyPair::generate()?;
let asset_definition_id = AssetDefinitionId::from_str("camomile#wonderland")?;
let create_asset = RegisterExpr::new(AssetDefinition::quantity(asset_definition_id.clone()));
let set_signature_condition = MintExpr::new(
    SignatureCheckCondition::AllAccountSignaturesAnd(
        vec![key_pair_2.public_key().clone()].into(),
    ),
    IdBox::AccountId(alice_id.clone()),
);

let mut client_configuration = ClientConfiguration::test(&network.genesis.api_address);
let client = Client::new(&client_configuration)?;
let instructions: [InstructionExpr; 2] = [create_asset.into(), set_signature_condition.into()];
client.submit_all_blocking(instructions)?;
```

```ts [TypeScript]
const registerAccount = pipe(
  sugar.identifiable.newAccount(
    MAD_HATTER,
    // Using only the first key
    [freeScope(() => KEYS[0].publicKey().toDataModel())],
  ),
  sugar.instruction.register,
)

const registerAssetDefinition = pipe(
  sugar.identifiable.newAssetDefinition(
    CASOMILE_DEFINITION_ID,
    datamodel.AssetValueType('Quantity'),
    {
      mintable: datamodel.Mintable('Infinitely'),
    },
  ),
  sugar.instruction.register,
)

const setSignatureCondition = sugar.instruction.mint(
  datamodel.Value(
    'SignatureCheckCondition',
    datamodel.SignatureCheckCondition(
      'AllAccountSignaturesAnd',
      datamodel.VecPublicKey(
        freeScope(() =>
          KEYS.map((keypair) => keypair.publicKey().toDataModel()),
        ),
      ),
    ),
  ),
  datamodel.IdBox('AccountId', MAD_HATTER),
)

// register Mad Hatter with the admin account

await blocks.wait(async () => {
  await clientAdmin.submitExecutable(
    pre,
    sugar.executable.instructions(registerAccount),
  )
})

// Register the asset definition with the Mad Hatter's account
await blocks.wait(async () => {
  await Torii.submit(
    pre,
    pipe(
      sugar.executable.instructions([
        registerAssetDefinition,
        setSignatureCondition,
      ]),
      (executable) =>
        makeTransactionPayload({ executable, accountId: MAD_HATTER }),
      (x) => makeSignedTransaction(x, signer1),
    ),
  )
})
```

:::

Then we build the transaction with the account's primary key:

::: code-group

```rust [Rust]
let quantity: u32 = 200;
let asset_id = AssetId::new(asset_definition_id, alice_id.clone());
let mint_asset = MintExpr::new(quantity.to_value(), IdBox::AssetId(asset_id.clone()));

let (public_key1, private_key1) = alice_key_pair.into();
client_configuration.account_id = alice_id.clone();
client_configuration.public_key = public_key1;
client_configuration.private_key = private_key1;
let client = Client::new(&client_configuration)?;
let instructions = [mint_asset.clone()];
let transaction = client.build_transaction(instructions, UnlimitedMetadata::new())?;
client.submit_transaction(&client.sign_transaction(transaction)?)?;
```

```ts [TypeScript]
const quantity = 100

const tx1 = makeSignedTransaction(
  makeTransactionPayload({
    executable: pipe(
      sugar.instruction.mint(
        sugar.value.numericU32(quantity),
        datamodel.IdBox(
          'AssetId',
          sugar.assetId(MAD_HATTER, CASOMILE_DEFINITION_ID),
        ),
      ),
      sugar.executable.instructions,
    ),
    accountId: MAD_HATTER,
  }),
  signer1,
)

await Torii.submit(pre, tx1)
```

:::

After that, we sign the same transaction with the second key and submit it:

::: code-group

```rust [Rust]
let (public_key2, private_key2) = key_pair_2.into();
client_configuration.public_key = public_key2;
client_configuration.private_key = private_key2;
let client_2 = Client::new(&client_configuration)?;
let instructions = [mint_asset];
let transaction = client_2.build_transaction(instructions, UnlimitedMetadata::new())?;
let transaction = client_2
    .get_original_transaction(&transaction, 3, Duration::from_millis(100))?
    .expect("Found no pending transaction for this account.");
client_2.submit_transaction(&client_2.sign_transaction(transaction)?)?;
```

```ts [TypeScript]
const tx2 =
  // we use `produce` from `immer` library
  // it allows us to produce a new value from `tx1` without touching it in a declarative way
  produce(tx1, (draft) => signTransaction(draft, signer2))

await Torii.submit(pre, tx2)
```

:::

You could find full code here: [Rust](https://www.example.com/),
[TypeScript](https://www.example.com/).

---

TODO:

- Add result assertions
- Make JS code complete
- Unify code between Rust and JS
- Make code concise
