# Kotlin/Java Guide

## 1. Iroha 2 Client Setup

In this part we shall cover the main things to look out for if you want to
use Iroha 2 in your Kotlin application. Instead of providing the complete
basics, we shall assume knowledge of the most widely used concepts, explain
the unusual, and provide some instructions for creating your own Iroha
2-compatible client.

We assume that you know how to create a new package and have basic
understanding of the fundamental Kotlin code. Specifically, we shall assume
that you know how to build and deploy your program on the target platforms.
To clone Iroha 2 JVM compatible SDKs, you can use [Iroha Java](https://github.com/hyperledger/iroha-java).

Without further ado, here's a part of an example `build.gradle.kts` file,
specifically, the `repositories` and `dependencies` sections:

```kotlin
plugins {
    kotlin("jvm") version "1.6.10"
}

repositories {
    // Use Maven Central for resolving dependencies
    mavenCentral()
    // Use Jitpack
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    // Align versions of all Kotlin components
    implementation(platform("org.jetbrains.kotlin:kotlin-bom"))
    // Use the Kotlin JDK 8 standard library
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    // Load the dependency used by the application
    implementation("com.google.guava:guava:31.0.1-jre")
    // Use the Kotlin test library
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    // Use the Kotlin JUnit integration
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit")
    // Load Iroha-related dependencies
    implementation("com.github.hyperledger.iroha-java:client:SNAPSHOT")
    implementation("com.github.hyperledger.iroha-java:block:SNAPSHOT")
    implementation("com.github.hyperledger.iroha-java:model:SNAPSHOT")
    implementation("com.github.hyperledger.iroha-java:test-tools:SNAPSHOT")
}
```

You **should** replace the SNAPSHOT in the above configuration with the
latest `iroha-java` snapshot.

Snapshot versions match the Git commits. To get the latest snapshot, simply
visit the
[`iroha-java`](https://github.com/hyperledger/iroha-java/tree/iroha2-dev)
repository on the `iroha-2-dev` branch and copy the short hash of the last
commit on the main page.

![](/img/iroha_java_hash.png)

You can also check the
[commit history](https://github.com/hyperledger/iroha-java/commits/iroha2-dev)
and copy the commit hash of a previous commit.

![](/img/iroha_java_commits.png)

This will give you the latest development release of Iroha 2.

## 2. Configuring Iroha 2

<!-- Check: a reference about future releases or work in progress -->

At present, the Kotlin SDK doesn't have any classes to interact with the
configuration. Instead, you are provided with a ready-made `Iroha2Client`
that reads the configuration from the environment variables and/or the
resident `config.json` in the working directory.

If you are so inclined, you can have a look at the `testcontainers` module,
and see how the `Iroha2Config` is implemented.

<<<@/snippets/IrohaConfig.kotlin

## 3. Querying and Registering Domains

Querying and Registering a domain are among the easier operations. The usual boilerplate
code, that often only serves to instantiate a client from an on-disk
configuration file, is unnecessary. Instead, you have to deal with a few
imports:

```kotlin
import jp.co.soramitsu.iroha2.*
import jp.co.soramitsu.iroha2.generated.datamodel.account.AccountId
import jp.co.soramitsu.iroha2.generated.datamodel.predicate.GenericValuePredicateBox
import jp.co.soramitsu.iroha2.generated.datamodel.predicate.value.ValuePredicate
import jp.co.soramitsu.iroha2.query.QueryBuilder
import kotlinx.coroutines.runBlocking
import java.net.URL
import java.security.KeyPair
```

We shall write this example in the form of a test class, hence the presence
of test-related packages. Note the presence of `coroutines.runBlocking`.
Iroha makes extensive use of asynchronous programming (in Rust
terminology), hence blocking is not necessarily the only mode of
interaction with the Iroha 2 code.

In order to make sure that the raised peers work correctly, you can do a simple 
operation to get all registered domains.

Next, we will add wrappers to the classes created in this section.

```kotlin
fun main(args: Array<String>): Unit = runBlocking{
    val peerUrl = "http://127.0.0.1:8080"
    val telemetryUrl = "http://127.0.0.1:8180"
    val admin = AccountId("bob".asName(), "wonderland".asDomainId())
    val adminKeyPair = keyPairFromHex("7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0",
        "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e")

    val client = AdminIroha2Client(URL(peerUrl), URL(telemetryUrl), log = true)
    val query = Query(client, admin, adminKeyPair)

    query.findAllDomains()
        .also { println("ALL DOMAINS: ${it.map { d -> d.id.asString() }}") }

}

open class Query (private val client: AdminIroha2Client,
                  private val admin: AccountId,
                  private val keyPair: KeyPair) {
    
    suspend fun findAllDomains(queryFilter: GenericValuePredicateBox<ValuePredicate>? = null) = QueryBuilder
        .findAllDomains(queryFilter)
        .account(admin)
        .buildSigned(keyPair)
        .let { client.sendQuery(it) }
}
```

The output in the terminal will contain a list of all domains that are currently registered.

::: details Expand to see the expected output

```
ALL DOMAINS: [wonderland, genesis, garden_of_live_flowers]
```

:::

To register a new domain, add the following lines to Main.kt:

```kotlin
val sendTransaction = SendTransaction(client, admin, adminKeyPair)

val domain = "domain_${System.currentTimeMillis()}"
    sendTransaction.registerDomain(domain).also { println("DOMAIN $domain CREATED") }
```

Then create new open class `SendTransaction` in your project:

```kotlin
open class SendTransaction (private val client: AdminIroha2Client,
                            private val admin: AccountId,
                            private val keyPair: KeyPair,
                            private val timeout: Long = 10000) {

    suspend fun registerDomain(
        id: String,
        metadata: Map<Name, Value> = mapOf(),
        admin: AccountId = this.admin,
        keyPair: KeyPair = this.keyPair
    ) {
        client.sendTransaction {
            account(admin)
            this.registerDomain(id.asDomainId(), metadata)
            buildSigned(keyPair)
        }.also {
            withTimeout(timeout) { it.await() }
        }
    }
}
```

::: details Expand to see the expected output

```
ALL DOMAINS: [wonderland, domain_1684411658477, genesis, garden_of_live_flowers]
```

:::

## 4. Registering an Account

Registering an account is more involved than the aforementioned functions.
Previously, we only had to worry about submitting a single instruction,
with a single string-based registration box (in Rust terminology, the
heap-allocated reference types are all called boxes).

When registering an account, there are a few more variables. The account
can only be registered to an existing domain. Also, an account typically
has to have a key pair. 

To register a new account, add the following lines to `Main.kt`:

```Kotlin
    val joe = "joe_${System.currentTimeMillis()}$ACCOUNT_ID_DELIMITER$domain"
    val joeKeyPair = generateKeyPair()
    sendTransaction.registerAccount(joe, listOf(joeKeyPair.public.toIrohaPublicKey()))
        .also { println("ACCOUNT $joe CREATED") }

    query.findAllAccounts()
        .also { println("ALL ACCOUNTS: ${it.map { a -> a.id.asString() }}") }
```

Then implement new method for class `SendTransaction` in your project.

```Kotlin
    suspend fun registerAccount(
        id: String,
        signatories: List<PublicKey>,
        metadata: Map<Name, Value> = mapOf(),
        admin: AccountId = this.admin,
        keyPair: KeyPair = this.keyPair
    ) {
        client.sendTransaction {
            account(admin)
            this.registerAccount(id.asAccountId(), signatories, Metadata(metadata))
            buildSigned(keyPair)
        }.also {
            withTimeout(timeout) { it.await() }
        }
    }
```

::: details Expand to see the expected output

```
DOMAIN domain_1684491906610 CREATED
ACCOUNT joe_1684491909340@domain_1684491906610 CREATED
ALL ACCOUNTS: [joe_1684414800075@domain_1684414798255, alice@wonderland, bob@wonderland, genesis@genesis, carpenter@garden_of_live_flowers]

```

:::

As you can see, for _illustrative purposes_, we have generated a new
key-pair. We converted that key-pair into an Iroha-compatible format using
`toIrohaPublicKey`, and added the public key to the instruction to register
an account.

## 5. Registering and minting assets

Iroha has been built with few
[underlying assumptions](./blockchain/assets.md) about what the assets need
to be in terms of their value type and characteristics (fungible or
non-fungible, mintable or non-mintable).

::: info

<!-- Check: a reference about future releases or work in progress -->

The non-mintable assets are a relatively recent addition to Iroha 2, thus
registering and minting such assets is not presently possible through the
Kotlin SDK.

:::

<<<@/snippets/InstructionsTest.kt#java_register_asset{kotlin}

<<<@/snippets/InstructionsTest.kt#java_mint_asset{kotlin}

Note that our original intention was to register an asset named
_time#looking_glass_ that was non-mintable. Due to a technical limitation
we cannot prevent that asset from being minted. However, we can ensure that
the late bunny is always late: _alice@wonderland_ can mint time but only to
her account initially.

If she tried to mint an asset that was registered using a different client,
which was non-mintable, this attempt would have been rejected, _and Alice
alongside her long-eared, perpetually stressed friend would have no way of
making more time_.

## 6. Visualizing outputs

Finally, we should talk about visualising data. The Rust API is currently
the most complete in terms of available queries and instructions. After
all, this is the language in which Iroha 2 was built. Kotlin, by contrast,
supports only some features.

There are two possible event filters: `PipelineEventFilter` and
`DataEventFilter`, we shall focus on the former. This filter sieves events
pertaining to the process of submitting a transaction, executing a
transaction and committing it to a block.

```kotlin
import jp.co.soramitsu.iroha2.generated.datamodel.events.EventFilter.Pipeline
import jp.co.soramitsu.iroha2.generated.datamodel.events.pipeline.EventFilter
import jp.co.soramitsu.iroha2.generated.datamodel.events.pipeline.EntityType.Transaction
import jp.co.soramitsu.iroha2.generated.crypto.hash.Hash

val hash: ByteArray
val eventFilter = Pipeline(EventFilter(Transaction(), Hash(hash)))
```

What this short code snippet does is the following: It creates an event
pipeline filter that checks if a transaction with the specified hash was
submitted/rejected. This can then be used to see if the transaction we
submitted was processed correctly and provide feedback to the end-user.

## 7. Samples in pure Java

<<<@/snippets/JavaTest.java
