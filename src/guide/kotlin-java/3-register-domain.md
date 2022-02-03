# 3. Registering a Domain (Kotlin/Java)

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

We shall write this example in the form of a test class, hence the presence of test-related packages. Note the presence of `coroutines.runBlocking`. Iroha makes extensive use of asynchronous programming (in `rust` terminology), hence blocking is not necessarily the only mode of interaction with the Iroha 2 code.

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
