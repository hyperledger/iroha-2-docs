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

[//]: # 'TODO: rewrite above schema with mermaid'

The following example shows the relationship between domains, accounts, and
assets.

<div class="domains-example-scope">

```mermaid
classDiagram

class domain_wonderland {
  id = "wonderland"
}
class account_alice:::aliceblue {
  id = "alice@wonderland"
}
class account_mad_hatter:::aliceblue {
  id = "mad_hatter@wonderland"
}

class asset_rose:::pink {
  id = "rose#wonderland"
}

domain_wonderland *-- account_alice : registered in
domain_wonderland *-- asset_rose : registered in
account_alice *-- asset_rose : registered by
domain_wonderland *-- account_mad_hatter : registered in

class domain_looking_glass {
  id = "looking_glass"
}

class account_rabbit:::aliceblue {
  id = "white_rabbit@looking_glass"
}

domain_looking_glass *-- account_rabbit : registered in
```

</div>

<style scoped lang="scss">
.domains-example-scope {
  :deep(.aliceblue) rect {
      stroke: rgba(59, 130, 246, 0.8) !important;
      stroke-width: 4 !important;
  }

  :deep(.pink) rect {
    stroke: rgba(246, 50, 100, 0.8) !important;
    stroke-width: 4 !important;
  }
}
</style>

::: details Language-specific guidance on registering these objects

| Language              | Guide                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bash                  | Register a [domain](/guide/bash.md#_3-registering-a-domain), an [account](/guide/bash.md#_4-registering-an-account), an [asset](/guide/bash.md#_5-registering-and-minting-assets)                      |
| Rust                  | Register a [domain](/guide/rust.md#_3-registering-a-domain), an [account](/guide/rust.md#_4-registering-an-account), an [asset](/guide/rust.md#_5-registering-and-minting-assets)                      |
| Kotlin/Java           | Register a [domain](/guide/kotlin-java.md#_3-registering-a-domain), an [account](/guide/kotlin-java.md#_4-registering-an-account), an [asset](/guide/kotlin-java.md#_5-registering-and-minting-assets) |
| Python                | Register a [domain](/guide/python.md#_3-registering-a-domain), an [account](/guide/python.md#_4-registering-an-account), an [asset](/guide/python.md#_5-registering-and-minting-assets)                |
| JavaScript/TypeScript | Register a [domain](/guide/javascript.md#_3-registering-a-domain), an [account](/guide/javascript.md#_4-registering-an-account), an [asset](/guide/javascript.md#_5-registering-and-minting-assets)    |

:::

The diagram below provides a more detailed illustration of the relationship
between domains, accounts, and assets in the blockchain. You can learn more
about [permissions and roles](./permissions.md) and [metadata](metadata.md)
in the corresponding sections. The asset structure is illustrated in a
[dedicated chapter](./assets.md).

```mermaid
classDiagram

class Domain
class Account
class AssetDefinition
class Asset

Domain *-- "many" Account : contains
Domain *-- "many" AssetDefinition : contains
Account *-- "many" Asset : contains
Asset -- AssetDefinition

Domain : id
Domain : accounts
Domain : asset_definitions
Domain : logo
Domain : metadata

Account : id
Account : assets
Account : signatories
Account : signature_check_condition
Account : metadata
Account : roles


AssetDefinition : id
AssetDefinition : value_type
AssetDefinition : mintable
AssetDefinition : metadata

Asset : id
Asset : value
```

