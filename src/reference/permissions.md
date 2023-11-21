# Permissions

This section provides details about pre-configured permission tokens in Iroha 2. For more general information on permission tokens and permission groups (roles), refer to the [Permissions](/guide/blockchain/permissions) chapter in Guide.

## Permission Tokens

The following permission tokens are pre-configured in Iroha 2:

| Permission Token                                                                            | Category         | Operation        |
| ------------------------------------------------------------------------------------------- | ---------------- | ---------------- |
| [`CanSetKeyValueInUserMetadata`](#cansetkeyvalueinusermetadata)                             | Account          | Set key value    |
| [`CanRemoveKeyValueInUserMetadata`](#canremovekeyvalueinusermetadata)                       | Account          | Remove key value |
| [`CanBurnUserAssets`](#canburnuserassets)                                                   | Asset            | Burn             |
| [`CanSetKeyValueInUserAssets`](#cansetkeyvalueinuserassets)                                 | Asset            | Set key value    |
| [`CanRemoveKeyValueInUserAssets`](#canremovekeyvalueinuserassets)                           | Asset            | Remove key value |
| [`CanTransferUserAssets`](#cantransferuserassets)                                           | Asset            | Transfer         |
| [`CanTransferOnlyFixedNumberOfTimesPerPeriod`](#cantransferonlyfixednumberoftimesperperiod) | Asset            | Transfer         |
| [`CanMintUserAssetDefinitions`](#canmintuserassetdefinitions)                               | Asset Definition | Mint             |
| [`CanBurnAssetWithDefinition`](#canburnassetwithdefinition)                                 | Asset Definition | Burn             |
| [`CanUnregisterAssetWithDefinition`](#canunregisterassetwithdefinition)                     | Asset Definition | Unregister       |
| [`CanSetKeyValueInAssetDefinition`](#cansetkeyvalueinassetdefinition)                       | Asset Definition | Set key value    |
| [`CanRemoveKeyValueInAssetDefinition`](#canremovekeyvalueinassetdefinition)                 | Asset Definition | Remove key value |
| [`CanRegisterDomains`](#canregisterdomains)                                                 | Domain           | Register         |

::: info

The way permission work in Iroha 2 is subject to change. Note that there
won't be pre-configured permissions in the future.

:::

### `CanMintUserAssetDefinitions`

With `CanMintUserAssetDefinitions`, a user can register and mint assets
with the corresponding asset definition.

```rust
let mut genesis = RawGenesisBlock::new(
    "alice".parse(),
    "wonderland".parse(),
    get_key_pair().public_key().clone(),
);
let rose_definition_id =
    AssetDefinitionId::from_str("rose#wonderland")?;
let alice_id =
    AccountId::from_str("alice@wonderland")?;

// Create a new `CanMintUserAssetDefinitions` permission token
// to mint rose assets (`rose_definition_id`)
let mint_rose_permission: PermissionToken =
    CanMintUserAssetDefinitions::new(rose_definition_id).into();

// Grant Alice permission to mint rose assets
genesis.transactions[0]
    .isi
    .push(GrantBox::new(mint_rose_permission, alice_id).into());
```

### `CanBurnAssetWithDefinition`

With `CanBurnAssetWithDefinition` permission token, a user can burn and
unregister assets with the corresponding asset definition.

```rust
let mut genesis = RawGenesisBlock::new(
    "alice".parse(),
    "wonderland".parse(),
    get_key_pair().public_key().clone(),
);
let rose_definition_id =
    AssetDefinitionId::from_str("rose#wonderland")?;
let alice_id =
    AccountId::from_str("alice@wonderland")?;

// Create a new `CanBurnAssetWithDefinition` permission token
// to burn rose assets (`rose_definition_id`)
let burn_rose_permission: PermissionToken =
    CanBurnAssetWithDefinition::new(rose_definition_id).into();

// Grant Alice permission to burn rose assets
genesis.transactions[0]
    .isi
    .push(GrantBox::new(burn_rose_permission, alice_id).into());
```

### `CanBurnUserAssets`

With `CanBurnUserAssets` permission token, a user can burn the specified
asset.

```rust
let alice_id = AccountId::from_str("alice@test")?;
let bob_id = AccountId::from_str("bob@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanBurnUserAssets` permission token
// that allows burning `alice_xor_id` asset
let permission_token_to_alice: PermissionToken =
    burn::CanBurnUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission to burn `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_token_to_alice,
    IdBox::AccountId(bob_id),
));
```

### `CanUnregisterAssetWithDefinition`

With `CanUnregisterAssetWithDefinition` permission token, a user can
unregister assets with the corresponding asset definition.

```rust
let alice_id = AccountId::from_str("alice@test")?;
let bob_id = AccountId::from_str("bob@test")?;
let xor_id = AssetDefinitionId::from_str("xor#test")?;

// Create a new `CanUnregisterAssetWithDefinition` permission token
// that allows unregistering `xor_id` asset
let permission_token_to_alice: PermissionToken =
    unregister::CanUnregisterAssetWithDefinition::new(xor_id).into();

// Create an instruction that grants Bob permission to unregister `xor_id` asset
let grant = Instruction::Grant(GrantBox {
    permission_token_to_alice.into(),
    IdBox::AccountId(bob_id).into(),
});
```

### `CanTransferUserAssets`

With `CanTransferUserAssets` permission token, a user can transfer the
specified asset.

```rust
let alice_id = AccountId::from_str("alice@test")?;
let bob_id = AccountId::from_str("bob@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanTransferUserAssets` permission token
// that allows to transfer `alice_xor_id` asset
let permission_token_to_alice: PermissionToken =
    transfer::CanTransferUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission to transfer `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_token_to_alice,
    IdBox::AccountId(bob_id),
));
```

### `CanTransferOnlyFixedNumberOfTimesPerPeriod`

With `CanTransferOnlyFixedNumberOfTimesPerPeriod` permission token, a user
can transfer assets only a fixed number of times per some time period.

```rust
const PERIOD_MS: u64 = 5000;
const COUNT: u32 = 2;

// Create a new `CanTransferOnlyFixedNumberOfTimesPerPeriod` permission token
// that limits the number of transfer to 2 per 5000 ms.
let permission_token =
    transfer::CanTransferOnlyFixedNumberOfTimesPerPeriod::new(PERIOD_MS.into(), COUNT);
```

### `CanSetKeyValueInUserAssets`

With `CanSetKeyValueInUserAssets` permission token, a user can set key
value in the specified asset.

```rust
let bob_id = AccountId::from_str("bob@test")?;
let alice_id = AccountId::from_str("alice@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanSetKeyValueInUserAssets` permission token
// that allows to set key value in `alice_xor_id` asset
let permission_to_set_key_value_in_xor: PermissionToken =
    key_value::CanSetKeyValueInUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission
// to set key value in `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_to_set_key_value_in_xor,
    IdBox::AccountId(bob_id),
));
```

### `CanRemoveKeyValueInUserAssets`

With `CanRemoveKeyValueInUserAssets` permission token, a user can remove
key value in the specified asset.

```rust
let bob_id = AccountId::from_str("bob@test")?;
let alice_id = AccountId::from_str("alice@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanRemoveKeyValueInUserAssets` permission token
// that allows to remove key value from `alice_xor_id` asset
let permission_to_set_key_value_in_xor: PermissionToken =
    key_value::CanRemoveKeyValueInUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission
// to remove key value from `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_to_set_key_value_in_xor,
    IdBox::AccountId(bob_id),
```

### `CanSetKeyValueInUserMetadata`

With `CanSetKeyValueInUserMetadata` permission token, a user can set a key
value pair in the [metadata](/guide/blockchain/metadata.md) for the
specified account.

```rust
let mouse_id = AccountId::from_str("mouse@wonderland")?;

// Create a new `CanSetKeyValueInUserMetadata` token that, when granted to another account,
// allows it to set key value to the metadata in Mouse's account
let permission_to_set_key_value_in_mouse_metadata: PermissionToken =
    key_value::CanSetKeyValueInUserMetadata::new(mouse_id).into();
```

### `CanRemoveKeyValueInUserMetadata`

With `CanRemoveKeyValueInUserMetadata` permission token, a user can remove
a key value pair in the [metadata](/guide/blockchain/metadata.md) for the
specified account.

```rust
let mouse_id = AccountId::from_str("mouse@wonderland")?;

// Create a new `CanRemoveKeyValueInUserMetadata` token that, when granted to another account,
// allows it to remove key value from the metadata in Mouse's account
let permission_to_remove_key_value_in_mouse_metadata: PermissionToken =
    key_value::CanRemoveKeyValueInUserMetadata::new(mouse_id).into();
```

### `CanSetKeyValueInAssetDefinition`

With `CanSetKeyValueInAssetDefinition` permission token, a user can set key
value in the corresponding asset definition.

```rust
let bob_id = AccountId::from_str("bob@test")?;
let alice_id = AccountId::from_str("alice@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanSetKeyValueInAssetDefinition` permission token
// that allows to set key value in `alice_xor_id` asset definition
let permission_to_set_key_value_in_xor: PermissionToken =
    key_value::CanSetKeyValueInAssetDefinition::new(alice_xor_id).into();

// Create an instruction that grants Bob permission
// to set key value in `alice_xor_id` asset definition
let grant = Instruction::Grant(GrantBox::new(
    permission_to_set_key_value_in_xor,
    IdBox::AccountId(bob_id),
));
```

### `CanRemoveKeyValueInAssetDefinition`

With `CanRemoveKeyValueInAssetDefinition` permission token, a user can
remove key value in the corresponding asset definition.

```rust
let bob_id = AccountId::from_str("bob@test")?;
let alice_id = AccountId::from_str("alice@test")?;
let alice_xor_id = AssetId::new(
    AssetDefinitionId::from_str("xor#test")?,
    AccountId::from_str("alice@test")?,
);

// Create a new `CanRemoveKeyValueInAssetDefinition` permission token
// that allows to remove key value from `alice_xor_id` asset definition
let permission_to_remove_key_value_from_xor: PermissionToken =
    key_value::CanRemoveKeyValueInAssetDefinition::new(alice_xor_id).into();

// Create an instruction that grants Bob permission
// to remove key value from `alice_xor_id` asset definition
let grant = Instruction::Grant(GrantBox::new(
    permission_to_remove_key_value_from_xor,
    IdBox::AccountId(bob_id),
));
```

### `CanRegisterDomains`

With `CanRegisterDomains` permission token, a user can
[register](/guide/blockchain/instructions.md#un-register) domains.

```rust
let alice_id = AccountId::from_str("alice@test0")?;
let mut alice = Account::new(alice_id, []).build();

// Create a new `CanRegisterDomains` permission token
// that allows registering new domains
let permission_token_to_register_domains: PermissionToken =
    register::CanRegisterDomains::new().into();

// Create an instruction that grants Alice permission to register new domains
let grant = Instruction::Grant(GrantBox::new(
    permission_token_to_register_domains,
    IdBox::AccountId(alice_id),
```
