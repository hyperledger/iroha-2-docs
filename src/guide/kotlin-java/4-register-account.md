# 4. Registering an Account (Kotlin/Java)

Registering a domain is more involved than the aforementioned functions. Previously, we only had to worry about submitting a single instruction, with a single string-based registration box (In `rust` terminology, the heap-allocated reference types are all called boxes).

When registering a domain, there are a few more variables: The account can only be registered to an existing domain. Also, an account typically has to have a key pair. So if e.g. _alice@wonderland_ was registering an account for _late_bunny@looking_glass_ she should provide his public key.

It is tempting to generate both the private and public keys at this time, but it isn't the brightest idea. Remember*,* that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? **Instead, the best way is to **ask\*\* _late_bunny_ to generate a new key-pair, and give you the public half of it.

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
