# Queries

Although much of the information about the state of the blockchain can be obtained, as we've shown before, using an event subscriber and using a filter to narrow the scope of the events to those of interest, sometimes, one needs to take a more direct approach. Enter queries. They are small instruction-like objects that, when sent to an Iroha peer, prompt a response with details from the current world state view.

::: info

As of writing, most queries can not be filtered, but can be paginated. As such, some queries, which we'll mark with a warning sign, should be used with care, and you should think carefully about the pagination scheme.

:::

In the following section we shall try to mirror the module structure of the queries and present to you what they do.

Before we proceed, we should discuss a few conventions. We use the expressions _gets_, _returns_, _searches_ with a precise meaning in the following (somewhat encyclopædic) section.
- _gets_, means that the query already has the data readily available and the data is trivial. Use these queries at will;
- _returns_, means that the query has the data readily available, just as with _gets_, but by contrast the data is not trivial. You can still use these queries, but should be mindful not to ask for more information than you need;
- _searches_, differs from the above two. Data must be actively collected and neither the return type, nor the collection process are cheap. These queries should be used **extremely sparingly** regardless of whether they have a corresponding warning about data volume or not;

Another convention that we follow is that the queries are provided with just one data type as input, and parameterised by the type of the output. We should take some time to explain how to interpret the data.

## How to read `FindZByXAndY` queries

The queries will have a **Parameters** and a **Returns** section. The parameters can either be single or multiple types, while the output is almost always either one type, or a `Vec<Type>` kind of construction.

When we say "**Parameters**: (X, Y)", we mean that in Rust source code you need to construct the query as follows:

```rust
let query = FindZByXAndY::new(x, y);
```

where `x` is a variable of type `X`, and `y` — `Y` respectively. Where necessary we'll provide you with information about each type, otherwise, refer to the guide for each programming language for more information.

When we say, "Returns: Vec", we mean that the return value is a collection of more than one element of that type. Depending on the SDK implementation this can be a type native to the language (e.g. JavaScript) or a thin wrapper around the Rust Vec structure.

## Pagination

Submitting queries is done slightly differently in Rust. One can use `client.request(query)` to submit a query and get the full result in one go, both if you have a `Vec<Z>` and just `Z` as the return type.

However, some queries (particularly with "All" in their name) can return exorbitant amounts of data. As such, one should consider pagination to reduce the load on the system.

To construct a `Pagination` all one needs to do is to call `client.request_with_pagination(query, pagination)`, where the `pagination` is constructed as follows:

```rust
let starting_result: u32 = …;
let limit: u32 = …;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Roles

Roles are an optional feature that should be present on all Iroha 2 deployments by default when they're compiled in the private blockchain configuration.


### FindAllRoles

::: warning

This query returns a large volume of data.

:::

**Returns**: `Vec<Roles>`

This query doesn't need any parameters. It returns all roles registered as _global_ (as opposed to domain-scoped) in the blockchain.


### FindRolesByAccountId

**Parameters**: `AccountId`
**Returns**: `Vec<RoleId>`

This query returns all of the role identifiers that are attached to the given account. Note, that unlike [the previous query](#findallroles),  we do not return the roles themselves.


## Permissions

A semi-optional feature that depends on whether or not you want Iroha to manage a Public or Private Blockchain. Specifically, in both cases you have permissions, but in the public blockchain use-case, most accounts have the same common-sense permissions. By contrast in a private blockchain, most accounts are assumed not to be able to do anything outside of their own account or domain unless explicitly granted said permission.


### FindPermissionTokensByAccountId

**Parameters**: `AccountId`
**Returns**: `Vec<PermissionToken>`

This query returns all of the permission tokens granted to the specified account.

## Account

Most queries in Iroha pertain to accounts, and at the moment this is the most diverse set of queries.

### FindAllAccounts

::: warning

This query returns a large volume of data.

:::

**Returns**: `Vec<Account>`

This query finds all accounts registered globally.


### FindAccountById

**Parameters**: `AccountId`
**Returns**: `Account`

Returns the full account information corresponding to the given `AccountId`.


### FindAccountKeyValueByIdAndKey

**Parameters**: `(AccountId, Name)`
**Returns**: `Value`

This queries the `metadata` attached to the given account. Specifically it returns the value keyed by the provided `Name`.


### FindAccountsByName

**Parameters**: `Name`
**Returns**: `Vec<Account>`

This query returns all the accounts which have the given `Name`. This is particularly useful if you remember the name of the account, but do not, for example, recall the domain name in which it was registered.


### FindAccountsByDomainId

::: warning

This query returns a large volume of data.

:::

**Parameters**: `DomainId`
**Returns**: `Vec<Account>`

Find all of the accounts that belong to a specific domain. Note that this returns the full accounts and not the `AccountId` collection.


## Asset

Assets include simple numbers, but also a special type of key-to-value map, that is used as a secure data storage for privileged information.

### FindAllAssets

::: warning

This query returns a large volume of data.

:::

**Returns**: `Vec<Asset>`

Returns all of the known assets by value.

::: info

You should note that this is not the same as `AssetDefinition`. If you have one asset called e.g. `tea#wonderland` that belongs to every account on the blockchain, you will receive the aggregated value across all accounts, but not the information such as the type of the asset.

:::

### FindAllAssetDefinitions


::: warning

This query returns a large volume of data.

:::

**Returns**: `Vec<AssetDefinition>`

This query returns all known asset definitions by value.

::: tip

To reduce the load on the network, we store the definition of an asset separate from its instances. So if you want to know if an asset is mintable, or the type stored in the asset, you need to query the asset definition, rather than the asset itself.

:::


### FindAssetById

**Parameters**: `AssetId`
**Returns**: `Asset`

This query returns the aggregated data about an asset's use across the network.

### FindAssetsByName

**Parameters**: `Name`
**Returns**: `Vec<Asset>`

This query searches the network for all assets that match the given name.


### FindAssetsByAccountId

**Parameters**: `AccountId`
**Returns**: `Vec<Asset>`

This query returns all of the assets that belong to a single account.

### FindAssetsByAssetDefinitionId

::: warning

This query returns a large volume of data.

:::

**Parameters**: `AssetDefinitionId`
**Returns**: `Vec<Asset>`

This query will search for all of the assets that have the given definition Id.

### FindAssetsByDomainId

::: warning

This query returns a large volume of data.

:::

**Parameters**: `DomainId`
**Returns**: `Vec<Asset>`

This query returns all assets that are registered in the current domain.

### FindAssetsByDomainIdAndAssetDefinitionId

**Parameters**: `(DomainId, AssetDefinitionId)`
**Returns**: `Vec<Asset>`

This query searches the domain for assets that have the given definition id.

### FindAssetQuantityById

**Parameters**: `AssetId`
**Returns**: `u32`

This query assumes that the asset given by the identifier is of type `AssetValue::Quantity`, and returns the contained `u32`.

::: warning

This query can fail.

:::


### FindAssetKeyValueByIdAndKey

**Parameters**: `(AssetId, Name)`
**Returns**: `Value`

This query gets the value keyed by the given name in the metadata of the asset corresponding to the given identifier.


### FindAssetDefinitionKeyValueByIdAndKey

**Parameters**: `(AssetDefinitionId, Name)`
**Returns**: `Value`

This query gets the value keyed by the given name in the metadata of the asset definition corresponding to the given identifier.


## Domain

The domain is the basic unit of organisation in an Iroha blockchain. Accounts and assets must be registered inside a domain, triggers are usually scoped by domain, and most queries have the domain as a possible input.

### FindAllDomains

::: warning

This query returns the full contents of the world state view as of execution. This query should be used sparingly and for debugging purposes only.

:::

**Returns**: `Vec<Domain>`

This query returns all of the known registered domains.


### FindDomainById

::: warning

This query returns a large volume of data.

:::

**Parameters**: `DomainId`
**Returns**: `Domain`

This query gets the domain corresponding to the given identifier.


### FindDomainKeyValueByIdAndKey

**Parameters**: `(DomainId, Name)`
**Returns**: `Value`


This query returns the value keyed by the given name in the domain corresponding to the given identifier.


## Peer

A peer is the basic unit of storage and validation. In common parlance we may conflate the node and the peer binary running on the node, but in this case we specifically mean the peer binary as a server with its specific configuration.


### FindAllPeers

**Returns**: `Vec<Peer>`

This query returns all known peers identified by their key, and accompanied by the address of the API endpoint of each.

### FindAllParameters

**Returns**: `Vec<Parameter>`

Returns the parameters used by all peers in the network. Useful to debug if any of the peers are incorrectly configured and causing view changes.

::: info

The `Parameter` structure given for reference

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

:::


## Transaction

It is often necessary to query the state of specific transactions, especially for use in blockchain explorers and for user-facing applications.


### FindTransactionsByAccountId

::: warning

This query returns a large volume of data.

:::

**Parameters**: `AccountId`
**Returns**: `Vec<TransactionValue>`

::: info

The `TransactionValue` structure given for reference
```rust
pub enum TransactionValue {
    /// Committed transaction
    Transaction(Box<VersionedTransaction>),
    /// Rejected transaction with reason of rejection
    RejectedTransaction(Box<VersionedRejectedTransaction>),
}
```


:::

This query is used to get the full set of transactions that an account has submitted throughout the existence of the blockchain.


### FindTransactionByHash

**Parameters**: `Hash`
**Returns**: `TransactionValue`


This query finds the transaction by hash.
