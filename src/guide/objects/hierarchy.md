# Hierarchy

In language-specific guides we already walked you through registering
domains, accounts, and assets. Here we merely wish to illustrate the
relationship between various objects in the blockchain.

## Domains, Accounts, Assets

Let's start with an example that shows the relationship between domains,
accounts, and assets.

![Untitled](/img/domains-example.png)

::: details Language-specific guidance on registering these objects

| Language              | Guide                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bash                  | Register a [domain](../bash.md#_3-registering-a-domain), an [account](../bash.md#_4-registering-an-account), an [asset](../bash.md#_5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](../rust.md#_3-registering-a-domain), an [account](../rust.md#_4-registering-an-account), an [asset](../rust.md#_5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](../kotlin-java.md#_3-registering-a-domain), an [account](../kotlin-java.md#_4-registering-an-account), an [asset](../kotlin-java.md#_5-registering-and-minting-assets) |
| Python                | Register a [domain](../python.md#_3-registering-a-domain), an [account](../python.md#_4-registering-an-account), an [asset](../python.md#_5-registering-and-minting-assets)                |
| JavaScript/TypeScript | Register a [domain](../javascript.md#_3-registering-a-domain), an [account](../javascript.md#_4-registering-an-account), an [asset](../javascript.md#_5-registering-and-minting-assets)    |

:::

The diagram below provides a more detailed illustration of the relationship
between domains, accounts, and assets in the blockchain. You can learn more
about [permissions and roles](../advanced/permissions.md) and
[metadata](metadata.md) in the corresponding sections of the tutorial. The
asset structure is illustrated in a [dedicated chapter](./assets.md).

![Untitled](/img/domain-account-asset-diagram.png)

## Triggers

All triggers are essentially event triggers. We talk extensively about
triggers and how they work in the
[advanced section](../advanced/triggers.md) of this guide. Here we only
wish to highlight the relationship between triggers as objects in a
blockchain.

![Untitled](/img/triggers.png)

## Filters

### Data Filters

![Untitled](/img/data_filters.png)

![Untitled](/img/entity_filters.png)

## Instructions

The diagram below shows the available Iroha Special Instructions. For more
details, check out the [dedicated chapter](instructions.md).

![Untitled](/img/instructions.png)
