# Permissions

Accounts need permission tokens for various actions on a blockchain, e.g.
to mint or burn assets.

There is a difference between a public and a private blockchain in terms of
permissions granted to users. In a public blockchain, most accounts have
the same set of permissions. In a private blockchain, most accounts are
assumed not to be able to do anything outside of their own account or
domain unless explicitly granted said permission.

Having a permission to do something means having a `PermissionToken` to do
so. There are two ways for users to receive permission tokens: they can be
granted directly or as a part of a [`Role`](#permission-groups-roles) (a
set of permission tokens). Permissions are granted via `Grant` special
instruction. Permission tokens and roles do not expire, they can only be
removed using `Revoke` instruction.

## Permission Tokens

<!-- pre-configured permissions: LTS version -->

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
    <AssetDefinition as Identifiable>::Id::from_str("rose#wonderland")?;
let alice_id =
    <Account as Identifiable>::Id::from_str("alice@wonderland")?;

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
    <AssetDefinition as Identifiable>::Id::from_str("rose#wonderland")?;
let alice_id =
    <Account as Identifiable>::Id::from_str("alice@wonderland")?;

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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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

With `CanSetKeyValueInUserMetadata` permission token, a user can set key
value in the [metadata](../objects/metadata.md) for the specified account.

```rust
let mouse_id = <Account as Identifiable>::Id::from_str("mouse@wonderland")?;

// Create a new `CanSetKeyValueInUserMetadata` token that, when granted to another account,
// allows it to set key value to the metadata in Mouse's account
let permission_to_set_key_value_in_mouse_metadata: PermissionToken =
    key_value::CanSetKeyValueInUserMetadata::new(mouse_id).into();
```

### `CanRemoveKeyValueInUserMetadata`

With `CanRemoveKeyValueInUserMetadata` permission token, a user can remove
key value in the [metadata](../objects/metadata.md) for the specified
account.

```rust
let mouse_id = <Account as Identifiable>::Id::from_str("mouse@wonderland")?;

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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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
let alice_xor_id = <Asset as Identifiable>::Id::new(
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
[register](./isi.md#unregister) domains.

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

## Permission Groups (Roles)

A set of permissions is called a **role**. Similarly to permission tokens,
roles can be granted using the `Grant` instruction and revoked using the
`Revoke` instruction.

Before granting a role to an account, the role should be registered first.

<!-- TODO: add more info about roles -->

### Register a new role

Let's register a new role that, when granted, will allow another account
access to the [metadata](../objects/metadata.md) in Mouse's account:

```rust
let role_id = <Role as Identifiable>::Id::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id)
    .add_permission(CanSetKeyValueInUserMetadata::new(mouse_id))
    .add_permission(CanRemoveKeyValueInUserMetadata::new(mouse_id));
let register_role = RegisterBox::new(role);
```

### Grant a role

After the role is registered, Mouse can grant it to Alice:

```rust
let grant_role = GrantBox::new(role_id, alice_id);
let grant_role_tx =
    Transaction::new(mouse_id, vec![grant_role.into()].into(), 100_000)
    .sign(mouse_key_pair)?;
```

## Permission Validators

Permissions exist so that only those accounts that have a required
permission token to perform a certain action could do so. In the stable and
LTS versions of Iroha 2, permission checks are implemented differently.

::: stable

In the stable version, the `Judge` trait is used to check permissions. The
`Judge` decides whether a certain operation (instruction, query, or
expression) could be performed based on the verdicts of multiple
validators.

Each validator returns one of the following verdicts: `Deny` (with the
exact reason to deny an operation), `Skip` (if an operation is not
supported or has no meaning in a given context), or `Allow`.

There are several `Judge`s already implemented in Iroha 2, such as:

| Judge                        | Description                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AtLeastOneAllow`            | The judge that succeeds only if there is at least one `Allow` verdict. The execution is stopped once there is a first `Allow` verdict.                                               |
| `NoDenies`                   | The judge that succeeds only if there is no `Deny` verdict. All validators are checked.                                                                                              |
| `NoDeniesAndAtLeastOneAllow` | The judge that succeeds only if there is no `Deny` verdict and at least one `Allow` verdict. The execution is stopped once there is a `Deny` verdict or all validators were checked. |
| `AllowAll`                   | For tests and simple cases. All operations are allowed to be executed for all possible values.                                                                                       |
| `DenyAll`                    | For tests and simple cases. All operations are disallowed to be executed for all possible for all possible values.                                                                   |

You can also build a custom permission validator by combining multiple
validators, all of which should be of the same type (for checking
instructions, queries, or expressions).

:::

::: lts

In the LTS version, permissions to execute an operation (instruction,
query, or expression) are checked via `IsAllowed` trait. If an operation is
not allowed, an error occurs. Permission validators could be also be
combined.

:::

<!-- ### Runtime Validators

TODO: https://github.com/hyperledger/iroha-2-docs/issues/140
After https://github.com/hyperledger/iroha/pull/2641 is merged, add info about runtime validators

-->

## Supported Queries

Permission tokens and roles can be queried.

Queries for roles:

- [FindAllRoles](./queries.md#findallroles)
- [FindAllRoleIds](./queries.md#findallroleids)
- [FindRoleByRoleId](./queries.md#findrolebyroleid)
- [FindRolesByAccountId](./queries.md#findrolesbyaccountid)

Queries for permission tokens:

- [FindAllPermissionTokenDefinitions](./queries.md#findallpermissiontokendefinitions)
- [FindPermissionTokensByAccountId](./queries.md#findpermissiontokensbyaccountid)
