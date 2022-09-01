# Hierarchy

In language-specific guides we already walked you through registering
domains, accounts, and assets. Here we merely wish to illustrate the
relationship between various objects in the blockchain.

## Domains, Accounts, Assets

Let's start with an example that shows the relationship between domains,
accounts, and assets.

![Untitled](/img/domains-example.png)

::: details Language-specific guidance on registering these objects

| Language              | Guide                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bash                  | Register a [domain](../bash.md#3-registering-a-domain), an [account](../bash.md#4-registering-an-account), an [asset](../bash.md#5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](../rust.md#3-registering-a-domain), an [account](../rust.md#4-registering-an-account), an [asset](../rust.md#5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](../kotlin-java.md#3-registering-a-domain), an [account](../kotlin-java.md#4-registering-an-account), an [asset](../kotlin-java.md#5-registering-and-minting-assets) |
| Python                | Register a [domain](../python.md#3-registering-a-domain), an [account](../python.md#4-registering-an-account), an [asset](../python.md#5-registering-and-minting-assets)                |
| JavaScript/TypeScript | Register a [domain](../javascript.md#3-registering-a-domain), an [account](../javascript.md#4-registering-an-account), an [asset](../javascript.md#5-registering-and-minting-assets)    |

:::

The diagram below provides a more detailed illustration of the relationship
between domains, accounts, and assets in the blockchain. You can learn more
about [permissions and roles](../advanced/permissions.md) and
[metadata](metadata.md) in the corresponding sections of the tutorial. The
asset structure is illustrated in a [dedicated chapter](./assets.md).

::: info

Note that the diagram below depicts Account structure for the LTS version
of Iroha. In the stable version, permission tokens are stored not within
the account but rather in the world state (WSV).

<!-- https://github.com/hyperledger/iroha/pull/2658 -->

:::

![Untitled](/img/domain-account-asset-diagram.png)
