# 2. Configuring Iroha 2 (Kotlin/Java)

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
