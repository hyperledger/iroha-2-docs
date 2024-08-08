# Iroha 2

Iroha is a fully-featured
[blockchain ledger](/reference/glossary.md#blockchain-ledgers). With Iroha you
can:

- Create and manage custom
  [fungible assets](/reference/glossary.md#fungible-assets), such as currencies,
  gold, and others
- Create and manage [non-fungible](/reference/glossary.md#non-fungible-assets)
  assets
- Manage user accounts with a domain hierarchy and multi-signature
  transactions
- Use efficient portable smart contracts implemented with 
  [WebAssembly](/guide/blockchain/wasm.md) and [Iroha Special Instructions](/guide/blockchain/instructions.md)
- Use both permissioned and permission-less blockchain deployments



## Get Started

1. [Install Iroha 2](/guide/get-started/install-iroha.md).
2. [Launch Iroha 2](/guide/get-started/launch-iroha.md).
3. [Learn how to operate Iroha via CLI](/guide/get-started/operate-iroha-via-cli.md) client: set up and
   configure Iroha 2, register a domain and an account, register and manage
   assets, and visualize outputs.
4. Once familiar with how Iroha works, proceed to the language-specific tutorials to learn how to build software on Iroha:
   - [Python](/guide/get-started/python.md)
   - [Rust](/guide/get-started/rust.md)
   - [Kotlin/Java](/guide/get-started/kotlin-java.md)
   - [Javascript (TypeScript)](/guide/get-started/javascript.md)


If you have previously worked with Iroha, start with our comparison of [Iroha 1 and Iroha 2](/guide/iroha-2.md). It will help you understand the differences between the two versions and upgrade to the newer one.

## Explore In-Depth

Once you've learned the basics, we suggest you read through the following:
  - [Security](/guide/security/index.md) section - learn about [core security principles](/guide/security/security-principles.md) and [operational security measures](/guide/security/operational-security.md) that are necessary to ensure the safety and validity of data and assets. This section also covers [cryptographic keys](/guide/security/public-key-cryptography.md), [how to generate them](/guide/security/generating-cryptographic-keys.md), and [how to store them securely](/guide/security/storing-cryptographic-keys.md).

  - Blockchain chapter - find documentation for Iroha features, such as [Iroha Special Instructions](/guide/blockchain/instructions.md), [triggers](/guide/blockchain/triggers.md), [queries](/guide/blockchain/queries.md).

  - Configuration and Management section - explore Iroha 2 configuration files in great detail, including topics such as [genesis blocks and accounts](/guide/configure/genesis.md), [client configuration](/guide/configure/client-configuration.md), and [public and private modes](/guide/configure/modes.md).

## Learn More

For more information on Iroha 2, please take a look at the
[Iroha 2 Whitepaper](https://github.com/hyperledger/iroha/tree/main/docs/source/iroha_2_whitepaper.md),
as well as the Hyperledger Iroha section within the
[Hyperledger Foundation Wiki](https://wiki.hyperledger.org/display/iroha).

For more information on Iroha 1, take a look at the
[Iroha 1 documentation](https://iroha.readthedocs.io/en/develop/index.html).

::: tip

If you want to contribute to Hyperledger Iroha, please look at our
[Contributing Guide](https://github.com/hyperledger/iroha/blob/main/CONTRIBUTING.md).

:::