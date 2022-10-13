<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Queries

Although much of the information about the state of the blockchain can be
obtained, as we've shown before, using an event subscriber and a filter to
narrow the scope of the events to those of interest, sometimes you need to
take a more direct approach. Enter _queries_.

Queries are small instruction-like objects that, when sent to an Iroha
peer, prompt a response with details from the current world state view.

This is not necessarily the only kind of information that is available on
the network, but it's the only kind of information that is _guaranteed_ to
be accessible on all networks.

For each deployment of Iroha, there might be other available information.
For example, the availability of telemetry data is up to the network
administrators. It's entirely their decision whether or not they want to
allocate processing power to track the work instead of using it to do the
actual work. By contrast, some functions are always required, e.g. having
access to your account balance.

The results of queries can be [sorted](#sorting), [paginated](#pagination)
and [filtered](#filters) peer-side all at once. Sorting is done
lexicographically on metadata keys. Filtering can be done on a variety of
principles, from domain-specific (individual IP address filter masks) to
sub-string methods like `begins_with` combined using logical operations.

## Conventions

In the following sections we shall try to mirror the module structure of
the queries and present to you what they do.

Before we proceed, we should discuss a few conventions. We use the
expressions _gets_, _returns_, _searches_ with a precise meaning in the
following (somewhat encyclopædic) section.

- _gets_ means that the query already has the data readily available and
  the data is trivial. Use these queries at will;
- _returns_ or _finds_ mean that the query has the data readily available,
  just as with _gets_, but the data is not trivial. You can still use these
  queries, but be mindful of the performance impact;
- _searches_ differs from the above two. Data must be actively collected
  and neither the return type nor the collection process is cheap. Use with
  great care.

Another convention that we follow is that the queries are provided with
just one data type as input, and parameterised by the type of the output.
We should take some time to explain how to interpret the data.

### How to read `FindZByXAndY` queries

The queries will have a **Parameters** and a **Returns** section. The
parameters can either be single or multiple types, while the output is
almost always either one type, or a `Vec<Type>` kind of construction.

#### Parameters

When we say

> **Parameters**: `(X, Y)`

we mean that in Rust source code you need to construct the query as
follows:

```rust
let query = FindZByXAndY::new(x: X, y: Y);
```

where `x` and `y` are variables of type `X` and `Y` respectively.

We'll provide you with information about each type, otherwise, refer to the
guide for each programming language for more information.

#### Returns

When we say

> **Returns**: `Vec<Z>`

we mean that the return value is a collection of more than one element of
type `Z`. Depending on the SDK implementation this can be a type native to
the language (e.g. JavaScript) or a thin wrapper around the Rust Vec
structure.

## Pagination

For both a `Vec<Z>` and just `Z` as the return type, you can use
`client.request(query)` to submit a query and get the full result in one
go.

However, some queries, particularly the ones with "All" in their names, can
return exorbitant amounts of data. As such, we highly recommend you
consider _pagination_ to reduce the load on the system.

To construct a `Pagination`, you need to call
`client.request_with_pagination(query, pagination)`, where the `pagination`
is constructed as follows:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filters

When you create a query, you can use a filter to only return the results
that match the specified filter.

<!-- TODO: add example -->

## Sorting

Iroha 2 can sort items with [metadata](../objects/metadata.md)
lexicographically if you provide a key to sort by during the construction
of the query. A typical use case is for accounts to have a `registered-on`
metadata entry, which, when sorted, allows you to view the account
registration history.

Sorting only applies to entities that have
[metadata](../objects/metadata.md), as the metadata key is used to sort
query results.

You can combine sorting with pagination and filters. Note that sorting is
an optional feature, most queries with pagination won't need it.

## Create a query

Use `QueryBox` to construct a query. For example, a query to find all
accounts would be created like this:

```rust
let query = QueryBox::FindAllAccounts(FindAllAccounts {});
```

Here is an example of a query that finds Alice's assets:

```rust
let alice_id =
    <Account as Identifiable>::Id::from_str("alice@wonderland")?;
let query = QueryBox::FindAssetsByAccountId(
    FindAssetsByAccountId::new(alice_id)
  );
```

<!--
Below we provide more sophisticated examples.

### Examples

TODO: add examples (#86) -->

## Role

An optional feature. By default, it is present on all Iroha 2 deployments
when they're compiled in the private blockchain configuration.

You can learn more about roles in a
[dedicated section](./permissions.md#permission-groups-roles).

### `FindAllRoles`

- **Returns**: `Vec<Roles>`

- **Details**: Returns all roles registered as _global_ (as opposed to
  _domain-scoped_) in the blockchain.

  <WarningFatQuery />

### `FindAllRoleIds`

- **Returns**: `Vec<Roles>`

- **Details**: Returns IDs of all the roles registered as _global_ (as
  opposed to _domain-scoped_) in the blockchain.

  Note that it does not return its values, which contain permission tokens,
  only IDs.

### `FindRoleByRoleId`

- **Parameters**: `RoleId`

- **Returns**: `Vec<Roles>`

- **Details**: Returns the role that has the provided role ID.

  For example, given the name of the role `admin`, it will return all of
  the `admin`-level permission tokens.

### `FindRolesByAccountId`

- **Parameters**: `AccountId`

- **Returns**: `Vec<RoleId>`

- **Details**: Returns all of the role IDs that are attached to the given
  account.

  Note that unlike [`FindAllRoles`](#findallroles), it does not return the
  roles themselves.

## Permission

A semi-optional feature. You have permissions in both public and private
blockchains but the use cases are different:

- In a public blockchain, most accounts have the same common-sense
  permissions.
- In a private blockchain, most accounts are assumed not to be able to do
  anything outside of their own account or domain unless explicitly granted
  said permission.

We talk about permissions in more detail in a
[dedicated chapter](./permissions.md).

### `FindAllPermissionTokenDefinitions`

- **Returns**: `Vec<PermissionTokenDefinition>`

- **Details**: Finds all registered permission token definitions.

### `FindPermissionTokensByAccountId`

- **Parameters**: `AccountId`

- **Returns**: `Vec<PermissionToken>`

- **Details**: Returns all of the permission tokens granted to the
  specified account.

## Account

Most queries in Iroha pertain to accounts. At the moment this is the most
diverse set of queries.

### `FindAllAccounts`

- **Returns**: `Vec<Account>`

- **Details**: Finds all accounts registered globally in the blockchain.

  <WarningFatQuery />

### `FindAccountById`

- **Parameters**: `AccountId`

- **Returns**: `Account`

- **Details**: Returns the full account information corresponding to the
  given `AccountId`.

### `FindAccountKeyValueByIdAndKey`

- **Parameters**: `(AccountId, Name)`

- **Returns**: `Value`

- **Details**: Returns the value keyed by the provided `Name` for the given
  account.

  This is done by querying the [`metadata`](../objects/metadata.md)
  attached to the given account.

### `FindAccountsByName`

- **Parameters**: `Name`

- **Returns**: `Vec<Account>`

- **Details**: Returns all of the accounts that have the given `Name`.

  This is particularly useful if you remember the name of the account, but
  do not, for example, recall the domain name in which it was registered.

### `FindAccountsByDomainId`

- **Parameters**: `DomainId`

- **Returns**: `Vec<Account>`

- **Details**: Returns all accounts that belong to a specific domain.

  Note that this returns the full accounts and not the `AccountId`
  collection.

  <WarningFatQuery />

### `FindAccountsWithAsset`

- **Parameters**: `AccountId`

- **Returns**: `Vec<Account>`

- **Details**: Returns all accounts that have the given asset.

## Asset

Assets include simple numbers, but also a special type of key-to-value map
that is used as a secure data storage for privileged information.

### `FindAllAssets`

- **Returns**: `Vec<Asset>`

- **Details**: Returns all known assets by value.

  <WarningFatQuery />

  ::: info

  You should note that this is not the same as `AssetDefinition`. If you
  have one asset called e.g. `tea#wonderland` that belongs to every account
  on the blockchain, you will receive the aggregated value across all
  accounts, but not the information such as the type of the asset.

  :::

### `FindAllAssetDefinitions`

- **Returns**: `Vec<AssetDefinition>`

- **Details**: Returns all known asset definitions by value.

  <WarningFatQuery />

  ::: tip

  To reduce the load on the network, we store the definition of an asset
  separate from its instances. So if you want to know if an asset is
  mintable or what type is stored in it, you need to query the asset
  definition, rather than the asset itself.

  :::

### `FindAssetById`

- **Parameters**: `AssetId`

- **Returns**: `Asset`

- **Details**: Returns the aggregated data about the asset usage across the
  network.

### `FindAssetsByName`

- **Parameters**: `Name`

- **Returns**: `Vec<Asset>`

- **Details**: Searches the network for all assets that match the given
  name.

### `FindAssetsByAccountId`

- **Parameters**: `AccountId`

- **Returns**: `Vec<Asset>`

- **Details**: Returns all of the assets that belong to a given account.

### `FindAssetsByAssetDefinitionId`

- **Parameters**: `AssetDefinitionId`

- **Returns**: `Vec<Asset>`

- **Details**: Searches for all of the assets that have the given
  definition ID.

<WarningFatQuery />

### `FindAssetsByDomainId`

- **Parameters**: `DomainId`

- **Returns**: `Vec<Asset>`

- **Details**: Returns all assets that are registered in the given domain.

<WarningFatQuery />

### `FindAssetsByDomainIdAndAssetDefinitionId`

- **Parameters**: `(DomainId, AssetDefinitionId)`

- **Returns**: `Vec<Asset>`

- **Details**: Searches the domain for assets that have the given
  definition ID.

### `FindAssetQuantityById`

- **Parameters**: `AssetId`

- **Returns**: `u32`

- **Details**: Returns the asset quantity.

  Note that this query assumes that the asset given by the identifier is of
  type `AssetValue::Quantity`.

  ::: warning

  This query can fail.

  :::

### `FindAssetKeyValueByIdAndKey`

- **Parameters**: `(AssetId, Name)`

- **Returns**: `Value`

- **Details**: Gets the value keyed by the given name in the
  [metadata](../objects/metadata.md) of the asset corresponding to the
  given identifier.

### `FindAssetDefinitionKeyValueByIdAndKey`

- **Parameters**: `(AssetDefinitionId, Name)`

- **Returns**: `Value`

- **Details**: Gets the value keyed by the given name in the
  [metadata](../objects/metadata.md) of the asset definition corresponding
  to the given identifier.

## Block

### FindAllBlocks

- **Returns**: `Vec<Block>`
- **Details**: Returns all blocks in the blockchain.

### FindAllBlockHeaders

- **Returns**: `Vec<BlockHeader>`
- **Details**: Returns all block headers for blocks in the blockchain.

### FindBlockHeaderByHash

- **Parameters**: `Hash`
- **Returns**: `BlockHeader`
- **Details**: Gets the block header that matches the hash that was
  provided.

## Domain

The domain is the basic unit of organisation in an Iroha blockchain.
Accounts and assets must be registered inside a domain, triggers are
usually scoped by domain, and most queries have the domain as a possible
input.

### `FindAllDomains`

- **Returns**: `Vec<Domain>`

- **Details**: Returns all of the known registered domains.

  ::: warning

  This query returns the full contents of the world state view as of
  execution. This query should be used sparingly and for debugging purposes
  only.

  :::

### `FindDomainById`

- **Parameters**: `DomainId`

- **Returns**: `Domain`

- **Details**: Gets the domain corresponding to the given identifier.

  <WarningFatQuery />

### `FindDomainKeyValueByIdAndKey`

- **Parameters**: `(DomainId, Name)`

- **Returns**: `Value`

- **Details**: Returns the value keyed by the given name in the domain
  corresponding to the given identifier.

## Peer

A peer is the basic unit of storage and validation. In common parlance we
may conflate the node and the peer binary running on the node, but in this
case we specifically mean the peer binary as a server with its specific
configuration.

### `FindAllPeers`

- **Returns**: `Vec<Peer>`

- **Details**: Returns all known peers identified by their key and
  accompanied by the address of the API endpoint of each.

### `FindAllParameters`

- **Returns**: `Vec<Parameter>`

  ```rust
  pub enum Parameter {
      /// Maximum amount of Faulty Peers in the system.
      MaximumFaultyPeersAmount(u32),
      /// Maximum time for a leader to create a block.
      BlockTime(u128),
      /// Maximum time for a proxy tail to send commit message.
      CommitTime(u128),
      /// Time to wait for a transaction Receipt.
      TransactionReceiptTime(u128),
  }
  ```

- **Details**: Returns the parameters used by all peers in the network.

  This is useful for debugging if any of the peers are incorrectly
  configured and causing view changes.

## Transaction

It is often necessary to query the state of specific transactions,
especially for use in blockchain explorers and for user-facing
applications.

### `FindTransactionsByAccountId`

- **Parameters**: `AccountId`

- **Returns**: `Vec<TransactionValue>`

  ```rust
  pub enum TransactionValue {
      /// Committed transaction
      Transaction(Box<VersionedSignedTransaction>),
      /// Rejected transaction with reason of rejection
      RejectedTransaction(Box<VersionedRejectedTransaction>),
  }
  ```

- **Details**: Returns the full set of transactions that an account has
  submitted throughout the existence of the blockchain.

  <WarningFatQuery />

### `FindTransactionByHash`

- **Parameters**: `Hash`

- **Returns**: `TransactionValue`

- **Details**: Returns the transaction by hash.

## Trigger

Iroha is an event-driven architecture. Every modification of the world
state emits a corresponding event that can be captured by appropriate event
listeners called filters.

### `FindAllActiveTriggerIds`

- **Returns**: `Vec<TriggerId>`

- **Details**: Finds all currently active triggers, that is, triggers that
  have not expired at the time of the query.

<WarningFatQuery />

### `FindTriggerById`

- **Parameters**: `TriggerId`

- **Returns**: `Trigger`

- **Details**: Finds the trigger with the given ID.

### `FindTriggerKeyValueByIdAndKey`

- **Parameters**: `(TriggerId, Name)`

- **Returns**: `Trigger`

- **Details**: Finds the value corresponding to the key in the
  [metadata](../objects/metadata.md) of the trigger with the given ID.

### `FindTriggersByDomainId`

- **Parameters**: `DomainId`

- **Returns**: `Vec<Trigger>`

- **Details**: Finds all domain triggers for the given domain ID.
