# Data Model

In language-specific guides we already walked you through registering
domains, accounts, and assets. Here we merely wish to illustrate the
relationship between various objects in the blockchain.

```

   +-----------------------------------------------+
   |                                               |
   |     +-----------------+                       |
   |     |Domain           |                       |
   |     +--------------+  |                       |
   |     ||Asset        |  |                       |
+--+--+  ||Definition(s)|  |                       |
|World|  +--------------+  |                       |
+--+--+  |                 |                       |
   |     +------------+    |                       |
   |     ||Account(s)||    | has   +-----------+   |
   |     |------------------------->Signatories|   |
   |     +-----------------+       +-----------+   |
   |                       |                       |
   |                       |  has  +--------+      |
   |                       +------->Asset(s)|      |
   |                               +--------+      |
   +-----------------------------------------------+

```

The following example shows the relationship between domains, accounts, and
assets.

![Domains Example](/img/domains-example.png)

::: details Language-specific guidance on registering these objects

| Language              | Guide                                                                                                                                                                                                  |
|-----------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bash                  | Register a [domain](/guide/bash.md#_3-registering-a-domain), an [account](/guide/bash.md#_4-registering-an-account), an [asset](/guide/bash.md#_5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](/guide/rust.md#_3-registering-a-domain), an [account](/guide/rust.md#_4-registering-an-account), an [asset](/guide/rust.md#_5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](/guide/kotlin-java.md#_3-registering-a-domain), an [account](/guide/kotlin-java.md#_4-registering-an-account), an [asset](/guide/kotlin-java.md#_5-registering-and-minting-assets) |
| Python                | Register a [domain](/guide/python.md#_3-registering-a-domain), an [account](/guide/python.md#_4-registering-an-account), an [asset](/guide/python.md#_5-registering-and-minting-assets)                |
| TypeScript/JavaScript | Register a [domain](/guide/javascript.md#_3-registering-a-domain), an [account](/guide/javascript.md#_4-registering-an-account), an [asset](/guide/javascript.md#_5-registering-and-minting-assets)    |

:::

The diagram below provides a more detailed illustration of the relationship
between domains, accounts, and assets in the blockchain. You can learn more
about [permissions and roles](./permissions.md) and [metadata](metadata.md)
in the corresponding sections. The asset structure is illustrated in a
[dedicated chapter](./assets.md).

![Domain, Account and Asset Diagram](/img/domain-account-asset-diagram.png)
