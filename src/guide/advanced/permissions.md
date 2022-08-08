# Permissions

Accounts need permission tokens for various actions on a blockchain, e.g.
to mint or burn assets.

There is a difference between a public and a private blockchain in terms of
permissions granted to users. In a public blockchain, most accounts have
the same set of permissions. In a private blockchain, most accounts are
assumed not to be able to do anything outside of their own account or
domain unless explicitly granted said permission.

Having a permission to do something means having a `PermissionToken` to do
so. There are two ways for users to receive permission tokens:

1. Permission tokens can be granted as part of one-time allowance.

   In this case, when a user mints a permission token, they are granted a
   fixed amount `X` of permission to do `Y`. Once the user performs the `Y`
   operation `X` times, the token expires.

2. Permission tokens can be granted as part of a `role` (a set of
   permission tokens).

   In this case, a user is permanently granted either a single permission
   or a group of permissions to perform a certain action. This is done via
   `Grant` special instructions, and the received permissions could be
   removed using `Revoke` instruction.

## Permission Tokens

The following permission tokens are pre-configured in Iroha 2:

| Permission Token                                                                            | Category         | Operation        |
| ------------------------------------------------------------------------------------------- | ---------------- | ---------------- |
| [`CanSetKeyValueInUserMetadata`](#cansetkeyvalueinusermetadata)                             | Account          | Set key value    |
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
    <AssetDefinition as Identifiable>::Id::from_str("rose#wonderland");
let alice_id =
    <Account as Identifiable>::Id::from_str("alice@wonderland");

// Create a new `CanMintUserAssetDefinitions` permission token
// to mint rose assets (`rose_definition_id`)
let mint_rose_permission: PermissionToken =
    CanMintUserAssetDefinitions::new(rose_definition_id.clone()).into();

// Grant Alice permission to mint rose assets
genesis.transactions[0]
    .isi
    .push(GrantBox::new(mint_rose_permission, alice_id.clone()).into());
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
    <AssetDefinition as Identifiable>::Id::from_str("rose#wonderland");
let alice_id =
    <Account as Identifiable>::Id::from_str("alice@wonderland");

// Create a new `CanBurnAssetWithDefinition` permission token
// to burn rose assets (`rose_definition_id`)
let burn_rose_permission: PermissionToken =
    CanBurnAssetWithDefinition::new(rose_definition_id.clone()).into();

// Grant Alice permission to burn rose assets
genesis.transactions[0]
    .isi
    .push(GrantBox::new(burn_rose_permission, alice_id.clone()).into());
```

### `CanBurnUserAssets`

With `CanBurnUserAssets` permission token, a user can burn the specified
asset.

```rust
let alice_id = AccountId::from_str("alice@test");
let bob_id = AccountId::from_str("bob@test");
let alice_xor_id = <Asset as Identifiable>::Id::new(
    AssetDefinitionId::from_str("xor#test"),
    AccountId::from_str("alice@test"),
);

// Create a new `CanBurnUserAssets` permission token
// that allows burning `alice_xor_id` asset
let permission_token_to_alice: PermissionToken =
    burn::CanBurnUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission to burn `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_token_to_alice,
    IdBox::AccountId(bob_id.clone()),
));
```

### `CanUnregisterAssetWithDefinition`

With `CanUnregisterAssetWithDefinition` permission token, a user can
unregister assets with the corresponding asset definition.

```rust
let alice_id = AccountId::from_str("alice@test");
let bob_id = AccountId::from_str("bob@test");
let xor_id = AssetDefinitionId::from_str("xor#test");

// Create a new `CanUnregisterAssetWithDefinition` permission token
// that allows unregistering `xor_id` asset
let permission_token_to_alice: PermissionToken =
    unregister::CanUnregisterAssetWithDefinition::new(xor_id).into();

// Create an instruction that grants Bob permission to unregister `xor_id` asset
let grant = Instruction::Grant(GrantBox {
    permission_token_to_alice.into(),
    IdBox::AccountId(bob_id.clone()).into(),
});
```

### `CanTransferUserAssets`

With `CanTransferUserAssets` permission token, a user can transfer the
specified asset.

```rust
let alice_id = AccountId::from_str("alice@test");
let bob_id = AccountId::from_str("bob@test");
let alice_xor_id = <Asset as Identifiable>::Id::new(
    AssetDefinitionId::from_str("xor#test"),
    AccountId::from_str("alice@test"),
);

// Create a new `CanTransferUserAssets` permission token
// that allows to transfer `alice_xor_id` asset
let permission_token_to_alice: PermissionToken =
    transfer::CanTransferUserAssets::new(alice_xor_id).into();

// Create an instruction that grants Bob permission to transfer `alice_xor_id` asset
let grant = Instruction::Grant(GrantBox::new(
    permission_token_to_alice,
    IdBox::AccountId(bob_id.clone()),
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

### `CanRemoveKeyValueInUserAssets`

With `CanRemoveKeyValueInUserAssets` permission token, a user can remove
key value in the specified asset.

### `CanSetKeyValueInUserMetadata`

With `CanSetKeyValueInUserMetadata` permission token, a user can set key
value in the metadata for the specified account.

```rust
let mouse_id = <Account as Identifiable>::Id::from_str("mouse@wonderland")?;

// Create a new `CanSetKeyValueInUserMetadata` token that, when granted to another account,
// allows it to set key value to the metadata in Mouse's account
let permission_to_set_key_value_in_mouse_metadata: PermissionToken =
    key_value::CanSetKeyValueInUserMetadata::new(mouse_id.clone()).into();
```

### `CanRemoveKeyValueInUserMetadata`

With `CanRemoveKeyValueInUserMetadata` permission token, a user can remove
key value in the metadata for the specified account.

```rust
let mouse_id = <Account as Identifiable>::Id::from_str("mouse@wonderland")?;

// Create a new `CanRemoveKeyValueInUserMetadata` token that, when granted to another account,
// allows it to remove key value from the metadata in Mouse's account
let permission_to_remove_key_value_in_mouse_metadata: PermissionToken =
    key_value::CanRemoveKeyValueInUserMetadata::new(mouse_id.clone()).into();
```

### `CanSetKeyValueInAssetDefinition`

With `CanSetKeyValueInAssetDefinition` permission token, a user can set key
value in the corresponding asset definition.

### `CanRemoveKeyValueInAssetDefinition`

With `CanRemoveKeyValueInAssetDefinition` permission token, a user can
remove key value in the corresponding asset definition.

### `CanRegisterDomains`

with `CanRegisterDomains` permission token, a user can register domains.

```rust
let alice_id = AccountId::from_str("alice@test0")
let mut alice = Account::new(alice_id.clone(), []).build();

// Give Alice permission to register new domains
alice.add_permission(register::CanRegisterDomains::new().into());
```

## Permission Groups (Roles)

A set of permissions is called a **role**. Roles can be granted and
revoked.

<!-- TODO: add more info about roles -->

### Register a new role

Let's register a new role that, when granted, will allow another account
access to the metadata in Mouse's account:

```rust
let role_id = <Role as Identifiable>::Id::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone())
    .add_permission(CanSetKeyValueInUserMetadata::new(mouse_id.clone()))
    .add_permission(CanRemoveKeyValueInUserMetadata::new(mouse_id.clone()));
let register_role = RegisterBox::new(role);
```

### Grant a role

After the role is registered, Mouse can grant it to Alice:

```rust
let grant_role = GrantBox::new(role_id.clone(), alice_id.clone());
let grant_role_tx =
    Transaction::new(mouse_id.clone(), vec![grant_role.into()].into(), 100_000)
    .sign(mouse_key_pair)?;
```

## Permission Validators

TBD <!-- TODO: add info about permission validators -->

## Supported Queries

Check the [list of supported queries](#queries/permission) for permissions.
