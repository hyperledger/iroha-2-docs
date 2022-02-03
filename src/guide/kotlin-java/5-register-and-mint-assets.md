# 5. Registering and minting assets (Kotlin/Java)

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
