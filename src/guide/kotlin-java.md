# Kotlin/Java guide

## 1. Iroha 2 Client Setup

In this part we shall cover the main things to look out for if you want to use Iroha 2 in your Kotlin application. Instead of providing the complete basics, we shall assume knowledge of the most widely used concepts, explain the unusual, and provide some instructions for creating your own Iroha 2-compatible client.

We assume that you know how to create a new package, and have basic understanding of the fundamental kotlin code. Specifically, we shall assume that you know how to build and deploy your program on the target platforms. The Iroha 2 JVM-compatible SDKs are as much a work-in-progress as the rest of this guide, and significantly more so than the Rust library.

Without further ado, here’s an example `build.gradle` file.

```kotlin
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}

dependencies {
        api 'com.github.hyperledger.iroha-java:client:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:model:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:block:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:testcontainers:iroha2-dev-SNAPSHOT'
}
```

This will give you the latest development release of Iroha 2.

## 2. Configuring Iroha 2

At present the Kotlin SDK doesn’t have any classes to interact with the configuration. Instead, you are provided with a ready-made `Iroha2Client` that reads the configuration from the environment variables and/or the resident `config.json` in the working directory.

If you are so inclined, you can have a look at the testcontainers module, and see how the `Iroha2Config` is implemented.

```kotlin
package jp.co.soramitsu.iroha2.testcontainers

import jp.co.soramitsu.iroha2.Genesis
import jp.co.soramitsu.iroha2.generated.core.genesis.GenesisTransaction
import jp.co.soramitsu.iroha2.generated.core.genesis.RawGenesisBlock
import org.slf4j.LoggerFactory.getLogger
import org.testcontainers.containers.Network
import org.testcontainers.containers.Network.newNetwork
import org.testcontainers.containers.output.OutputFrame
import org.testcontainers.containers.output.Slf4jLogConsumer
import java.util.function.Consumer

class IrohaConfig(
    var networkToJoin: Network = newNetwork(),
    var logConsumer: Consumer<OutputFrame> = Slf4jLogConsumer(getLogger(IrohaContainer::class.java)),
    var genesis: Genesis = Genesis(RawGenesisBlock(listOf(GenesisTransaction(listOf())))),
    var shouldCloseNetwork: Boolean = true,
    var maxLogLevel: MaxLogLevel = MaxLogLevel.INFO,
    var imageTag: String = IrohaContainer.DEFAULT_IMAGE_TAG
)

enum class MaxLogLevel {
    ERROR, WARN, INFO, DEBUG, TRACE
}
```

## 3. Registering a Domain

Registering a domain is one of the easier operations. The usual boiler-plate code, that often only serves to instantiate a client from an on-disk configuration file is unnecessary. Instead, one has to deal with a few imports:

```kotlin
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions
import jp.co.soramitsu.iroha2.engine.IrohaRunnerExtension
import jp.co.soramitsu.iroha2.Iroha2Client
import jp.co.soramitsu.iroha2.engine.WithIroha
import kotlinx.coroutines.runBlocking
import kotlin.test.assertEquals
import java.util.concurrent.TimeUnit
import jp.co.soramitsu.iroha2.generated.datamodel.account.Id as AccountId
```

We shall write this example in the form of a test class, hence the presence of test-related packages. Note the presence of `coroutines.runBlocking`. Iroha makes extensive use of asynchronous programming (in Rust terminology), hence blocking is not necessarily the only mode of interaction with the Iroha 2 code.

We have started by creating a mutable lazy-initialised client. This client is passed an instance of a domain registration box, which we get as a result of evaluating `registerDomain(domainName)`. Then the client is sent a transaction which consists of that one instruction. And that’s it.

```kotlin
@ExtendWith(IrohaRunnerExtension::class)
class Test {

    lateinit var client: Iroha2Client

    @Test
    @WithIroha
    fun `register domain instruction committed`(): Unit = runBlocking {
        val domainName = "looking_glass"
        val aliceAccountId = AccountId("alice", "wonderland")
        client.sendTransaction {
            accountId = AccountId("alice", "wonderland")
            registerDomain(domainName)
            buildSigned(ALICE_KEYPAIR)
        }.also {
            Assertions.assertDoesNotThrow {
                it.get(10, TimeUnit.SECONDS)
            }
        }

        QueryBuilder.findDomainByName(domainName)
            .account(aliceAccountId)
            .buildSigned(ALICE_KEYPAIR)
            .let { query -> client.sendQuery(query) }
            .also { result -> assertEquals(result.name, domainName) }
    }
}
```

Well almost. You may have noticed that we had to do this on behalf of `aliceAccountId`. This is because any transaction on the Iroha 2 blockchain has to be done by an account. This is a special account that must already exist on the blockchain. You can ensure that point by reading through `genesis.json` and seeing that **_alice_** indeed has an account, with a public key. Furthermore, the account's public key must be included in the configuration. If either of these two is missing, you will not be able to register an account, and will be greeted by an exception of an appropriate type.

## 4. Registering an Account

Registering a domain is more involved than the aforementioned functions. Previously, we only had to worry about submitting a single instruction, with a single string-based registration box (In Rust terminology, the heap-allocated reference types are all called boxes).

When registering a domain, there are a few more variables: The account can only be registered to an existing domain. Also, an account typically has to have a key pair. So if e.g. _alice@wonderland_ was registering an account for _late_bunny@looking_glass_ she should provide his public key.

It is tempting to generate both the private and public keys at this time, but it isn't the brightest idea. Remember, that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? Instead, the best way is to **ask** _late_bunny_ to generate a new key-pair, and give you the public half of it.

Similarly to the previous example, we provide the instructions in the form of a test:

```kotlin
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions
import jp.co.soramitsu.iroha2.engine.IrohaRunnerExtension
import jp.co.soramitsu.iroha2.Iroha2Client
import jp.co.soramitsu.iroha2.generateKeyPair
import jp.co.soramitsu.iroha2.engine.WithIroha
import kotlinx.coroutines.runBlocking
import kotlin.test.assertEquals
import java.util.concurrent.TimeUnit
import jp.co.soramitsu.iroha2.generated.datamodel.account.Id as AccountId

@ExtendWith(IrohaRunnerExtension::class)
class Test {

    lateinit var client: Iroha2Client

    @Test
    @WithIroha
    fun `register account instruction committed`(): Unit = runBlocking {
        val aliceAccountId = AccountId("alice", "wonderland")
        val newAccountId = AccountId("late_bunny", "looking_glass")
        val keyPair = generateKeyPair()
        val signatories = listOf(keyPair.public.toIrohaPublicKey())

        client.sendTransaction {
            accountId = aliceAccountId
            registerAccount(newAccountId, signatories)
            buildSigned(ALICE_KEYPAIR)
        }.also {
            Assertions.assertDoesNotThrow {
                it.get(10, TimeUnit.SECONDS)
            }
        }

        QueryBuilder.findAccountById(newAccountId)
            .account(aliceAccountId)
            .buildSigned(ALICE_KEYPAIR)
            .let { query -> client.sendQuery(query) }
            .also { account -> assertEquals(account.id, newAccountId) }
    }
}
```

As you can see, for _illustrative purposes_, we have generated a new key-pair. We converted that key-pair into an Iroha-compatible format using `toIrohaPublicKey`, and added the public key to the instruction to register the account. Again, it’s important to note that we are using _alice@wonderland_ as a proxy to interact with the blockchain, hence her credentials also appear in the transaction.

## 5. Registering and minting assets

Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be. The assets can be fungible (every £1 is exactly the same as every other £1), or non-fungible (a £1 bill signed by the Queen of Hearts is not the same as a £1 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block). Additionally, the assets have different underlying value types.

Specifically, we have `AssetValueType.Quantity` which is effectively an unsigned 32-bit integer, a `BigQuantity` which is an unsigned 128 bit integer; which is enough to trade all possible IPV6 addresses, and quite possibly individual grains of sand on the surface of the earth and `Fixed`, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. It doesn't quite use binary-coded decimal for performance reasons. All three types can be registered as either **mintable** or **non-mintable**.

::: info

The non-mintable assets are a relatively recent addition to Iroha 2, thus registering and minting such assets is not presently possible through the Kotlin SDK.

:::

```kotlin
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions
import jp.co.soramitsu.iroha2.engine.IrohaRunnerExtension
import jp.co.soramitsu.iroha2.Iroha2Client
import jp.co.soramitsu.iroha2.engine.WithIroha
import kotlinx.coroutines.runBlocking
import kotlin.test.assertEquals
import java.util.concurrent.TimeUnit
import jp.co.soramitsu.iroha2.generated.datamodel.asset.AssetValue
import jp.co.soramitsu.iroha2.generated.datamodel.asset.AssetValueType
import jp.co.soramitsu.iroha2.generated.datamodel.account.Id as AccountId
import jp.co.soramitsu.iroha2.generated.datamodel.asset.Id as AssetId
import jp.co.soramitsu.iroha2.generated.datamodel.asset.DefinitionId

@ExtendWith(IrohaRunnerExtension::class)
class Test {

    lateinit var client: Iroha2Client

    @Test
    @WithIroha
    fun `mint asset instruction committed`(): Unit = runBlocking {
        val aliceAccountId = AccountId("alice", "wonderland")
        val definitionId = DefinitionId("time", "looking_glass")
        val assetId = AssetId(definitionId, aliceAccountId)
				val newAccountId = AccountId("late_bunny", "looking_glass")
        val keyPair = generateKeyPair()
        val signatories = listOf(keyPair.public.toIrohaPublicKey())

        client.sendTransaction {
            account(aliceAccountId)
            registerAsset(definitionId, AssetValueType.Fixed())
            buildSigned(ALICE_KEYPAIR)
        }.also {
            Assertions.assertDoesNotThrow {
                it.get(10, TimeUnit.SECONDS)
            }
        }

        client.sendTransaction {
            account(aliceAccountId)
            mintAsset(assetId, 5)
            buildSigned(ALICE_KEYPAIR)
        }.also {
            Assertions.assertDoesNotThrow {
                it.get(10, TimeUnit.SECONDS)
            }
        }

        QueryBuilder.findAccountById(aliceAccountId)
            .account(aliceAccountId)
            .buildSigned(ALICE_KEYPAIR)
            .let { query -> client.sendQuery(query) }
            .also { result ->
                assertEquals(5, (result.assets[assetId]?.value as? AssetValue.Quantity)?.u32)
            }
    }
```

Note that our original intention was to register an asset named _time#looking_glass_ that was not mintable. Due to a technical limitation we cannot prevent that asset from being minted. However, we can ensure that the late bunny is always late, by noting that _alice@wonderland_ can mint time, but only to her account initially.

If she tried to mint an asset that was registered using a different client, which was not mintable, this attempt would have been rejected, _and alice alongside her long-eared, perpetually stressed friend would have no way of making more time_.

## 6. Visualizing outputs

Finally, we should talk about visualising data. The Rust API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built. Kotlin, by contrast supports only some features. Fortunately these features are not used/covered in the Rust tutorial either, so as to keep the walkthrough short and to-the-point.

There are two possible event filters: `PipelineEventFilter` and `DataEventFilter`, we shall focus on the former. This filter sieves events pertaining to the process of submitting a transaction, executing a transaction and committing it to a block.

```kotlin
import jp.co.soramitsu.iroha2.generated.datamodel.events.EventFilter.Pipeline
import jp.co.soramitsu.iroha2.generated.datamodel.events.pipeline.EventFilter
import jp.co.soramitsu.iroha2.generated.datamodel.events.pipeline.EntityType.Transaction
import jp.co.soramitsu.iroha2.generated.crypto.hash.Hash

val hash: ByteArray
val eventFilter = Pipeline(EventFilter(Transaction(), Hash(hash)))
```

What this short code snippet does is the following: It creates an event pipeline filter that checks if a transaction with the specified hash was submitted/rejected. This can then be used to see if the transaction we submitted was processed correctly and provide feedback to the end-user.
