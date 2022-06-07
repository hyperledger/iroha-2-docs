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
The Iroha 2 JVM-compatible SDKs are as much a work-in-progress as the rest
of this guide, and significantly more so than the Rust library.

Without further ado, here's the example `build.gradle` file:

```kotlin
allprojects {
    repositories {
        maven {
            url "https://nexus.iroha.tech/repository/maven-soramitsu/"
            metadataSources {
                artifact()
            }
        }
        maven { url "https://jitpack.io" }
    }
}

dependencies {
    implementation "jp.co.soramitsu.iroha2-java:client:iroha2-dev-SNAPSHOT"
    implementation "jp.co.soramitsu.iroha2-java:block:iroha2-dev-SNAPSHOT"
    implementation "jp.co.soramitsu.iroha2-java:model:iroha2-dev-SNAPSHOT"
    implementation "jp.co.soramitsu.iroha2-java:test-tools:iroha2-dev-SNAPSHOT"
    implementation "jp.co.soramitsu.iroha2-java:testcontainers:iroha2-dev-SNAPSHOT"
}

```

This will give you the latest development release of Iroha 2.

## 2. Configuring Iroha 2

At present, the Kotlin SDK doesn't have any classes to interact with the
configuration. Instead, you are provided with a ready-made `Iroha2Client`
that reads the configuration from the environment variables and/or the
resident `config.json` in the working directory.

If you are so inclined, you can have a look at the `testcontainers` module,
and see how the `Iroha2Config` is implemented.

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
    var imageTag: String = IrohaContainer.DEFAULT_IMAGE_TAG
)
```

## 3. Registering a Domain

Registering a domain is one of the easier operations. The usual boilerplate
code, that often only serves to instantiate a client from an on-disk
configuration file, is unnecessary. Instead, you have to deal with a few
imports:

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

We shall write this example in the form of a test class, hence the presence
of test-related packages. Note the presence of `coroutines.runBlocking`.
Iroha makes extensive use of asynchronous programming (in Rust
terminology), hence blocking is not necessarily the only mode of
interaction with the Iroha 2 code.

We have started by creating a mutable lazy-initialised client. This client
is passed an instance of a domain registration box, which we get as a
result of evaluating `registerDomain(domainName)`. Then the client is sent
a transaction which consists of that one instruction. And that's it.

```kotlin
@ExtendWith(IrohaRunnerExtension::class)
class Test {

    lateinit var client: Iroha2Client

    @Test
    @WithIroha(genesis = DefaultGenesis.class)
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

Well, almost. You may have noticed that we had to do this on behalf of
`aliceAccountId`. This is because any transaction on the Iroha 2 blockchain
has to be done by an account. This is a special account that must already
exist on the blockchain. You can ensure that point by reading through
`genesis.json` and seeing that **_alice_** indeed has an account, with a
public key. Furthermore, the account's public key must be included in the
configuration. If either of these two is missing, you will not be able to
register an account, and will be greeted by an exception of an appropriate
type.

## 4. Registering an Account

Registering an account is more involved than the aforementioned functions.
Previously, we only had to worry about submitting a single instruction,
with a single string-based registration box (in Rust terminology, the
heap-allocated reference types are all called boxes).

When registering an account, there are a few more variables: The account
can only be registered to an existing domain. Also, an account typically
has to have a key pair. So if e.g. _alice@wonderland_ was registering an
account for _white_rabbit@looking_glass_, she should provide his public
key.

It is tempting to generate both the private and public keys at this time,
but it isn't the brightest idea. Remember that _the white_rabbit_ trusts
_you, alice@wonderland,_ to create an account for them in the domain
_looking_glass_, **but doesn't want you to have access to that account
after creation**.

If you gave _white_rabbit_ a key that you generated yourself, how would
they know if you don't have a copy of their private key? Instead, the best
way is to **ask** _white_rabbit_ to generate a new key-pair, and give you
the public half of it.

Similarly to the previous example, we provide the instructions in the form
of a test:

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
    @WithIroha(genesis = DefaultGenesis.class)
    fun `register account instruction committed`(): Unit = runBlocking {
        val aliceAccountId = AccountId("alice", "wonderland")
        val newAccountId = AccountId("white_rabbit", "looking_glass")
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

As you can see, for _illustrative purposes_, we have generated a new
key-pair. We converted that key-pair into an Iroha-compatible format using
`toIrohaPublicKey`, and added the public key to the instruction to register
an account.

Again, it's important to note that we are using _alice@wonderland_ as a
proxy to interact with the blockchain, hence her credentials also appear in
the transaction.

## 5. Registering and minting assets

Now we must talk a little about assets. Iroha has been built with few
underlying assumptions about what the assets need to be.

The assets can be fungible (every £1 is exactly the same as every other
£1), or non-fungible (a £1 bill signed by the Queen of Hearts is not the
same as a £1 bill signed by the King of Spades), mintable (you can make
more of them) and non-mintable (you can only specify their initial quantity
in the genesis block).

Additionally, the assets have different underlying value types.
Specifically, we have `AssetValueType.Quantity`, which is effectively an
unsigned 32-bit integer, a `BigQuantity`, which is an unsigned 128-bit
integer, and `Fixed`, which is a positive (though signed) 64-bit
fixed-precision number with nine significant digits after the decimal
point. All three types can be registered as either **mintable** or
**non-mintable**.

::: info

The non-mintable assets are a relatively recent addition to Iroha 2, thus
registering and minting such assets is not presently possible through the
Kotlin SDK.

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
    @WithIroha(genesis = DefaultGenesis.class)
    fun `mint asset instruction committed`(): Unit = runBlocking {
        val aliceAccountId = AccountId("alice", "wonderland")
        val definitionId = DefinitionId("time", "looking_glass")
        val assetId = AssetId(definitionId, aliceAccountId)
				val newAccountId = AccountId("white_rabbit", "looking_glass")
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

```java

import jp.co.soramitsu.iroha2.engine.DefaultGenesis;
import jp.co.soramitsu.iroha2.engine.IrohaRunnerExtension;
import jp.co.soramitsu.iroha2.engine.WithIroha;
import jp.co.soramitsu.iroha2.generated.datamodel.Name;
import jp.co.soramitsu.iroha2.generated.datamodel.asset.AssetValue;
import jp.co.soramitsu.iroha2.generated.datamodel.asset.AssetValueType;
import jp.co.soramitsu.iroha2.generated.datamodel.domain.Id;
import jp.co.soramitsu.iroha2.query.QueryBuilder;
import jp.co.soramitsu.iroha2.transaction.TransactionBuilder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static jp.co.soramitsu.iroha2.engine.TestConstsKt.*;

@ExtendWith(IrohaRunnerExtension.class)
public class JavaTest {

    public Iroha2Client client;

    @Test
    @WithIroha(genesis = DefaultGenesis.class)
    public void registerDomainInstructionCommitted() throws ExecutionException, InterruptedException, TimeoutException {
        final var domainId = new Id(new Name("new_domain_name"));
        final var transaction = TransactionBuilder.Companion
            .builder()
            .account(ALICE_ACCOUNT_ID)
            .registerDomain(domainId)
            .buildSigned(ALICE_KEYPAIR);
        client.sendTransaction(transaction).get(10, TimeUnit.SECONDS);

        final var query = QueryBuilder
            .findDomainById(domainId)
            .account(ALICE_ACCOUNT_ID)
            .buildSigned(ALICE_KEYPAIR);
        final var future = client.sendQueryAsync(query);
        final var domain = future.get(10, TimeUnit.SECONDS);
        Assertions.assertEquals(domain.getId(), domainId);
    }

    @Test
    @WithIroha(genesis = DefaultGenesis.class)
    public void registerAccountInstructionCommitted() throws Exception {
        final var accountId = new jp.co.soramitsu.iroha2.generated.datamodel.account.Id(
            new Name("new_account"),
            DEFAULT_DOMAIN_ID
        );
        final var transaction = TransactionBuilder.Companion
            .builder()
            .account(ALICE_ACCOUNT_ID)
            .registerAccount(accountId, List.of())
            .buildSigned(ALICE_KEYPAIR);
        client.sendTransaction(transaction).get(10, TimeUnit.SECONDS);

        final var query = QueryBuilder
            .findAccountById(accountId)
            .account(ALICE_ACCOUNT_ID)
            .buildSigned(ALICE_KEYPAIR);
        final var future = client.sendQueryAsync(query);
        final var account = future.get(10, TimeUnit.SECONDS);
        Assertions.assertEquals(account.getId(), accountId);
    }

    @Test
    @WithIroha(genesis = DefaultGenesis.class)
    public void mintAssetInstructionCommitted() throws Exception {
        final var registerAssetTx = TransactionBuilder.Companion
            .builder()
            .account(ALICE_ACCOUNT_ID)
            .registerAsset(DEFAULT_ASSET_DEFINITION_ID, new AssetValueType.Quantity())
            .buildSigned(ALICE_KEYPAIR);
        client.sendTransaction(registerAssetTx).get(10, TimeUnit.SECONDS);

        final var mintAssetTx = TransactionBuilder.Companion
            .builder()
            .account(ALICE_ACCOUNT_ID)
            .mintAsset(DEFAULT_ASSET_ID, 5L)
            .buildSigned(ALICE_KEYPAIR);
        client.sendTransaction(mintAssetTx).get(10, TimeUnit.SECONDS);

        final var query = QueryBuilder
            .findAccountById(ALICE_ACCOUNT_ID)
            .account(ALICE_ACCOUNT_ID)
            .buildSigned(ALICE_KEYPAIR);
        final var future = client.sendQueryAsync(query);
        final var account = future.get(10, TimeUnit.SECONDS);
        final var value = account.getAssets().get(DEFAULT_ASSET_ID).getValue();
        Assertions.assertEquals(5, ((AssetValue.Quantity) value).getU32());
    }

    @Test
    @WithIroha(genesis = DefaultGenesis.class)
    public void instructionFailed() {
        final var transaction = TransactionBuilder.Companion
            .builder()
            .account(ALICE_ACCOUNT_ID)
            .fail("FAIL MESSAGE")
            .buildSigned(ALICE_KEYPAIR);
        final var future = client.sendTransaction(transaction);
        Assertions.assertThrows(ExecutionException.class, () -> future.get(10, TimeUnit.SECONDS));
    }
}
```
