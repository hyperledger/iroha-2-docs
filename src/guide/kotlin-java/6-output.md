# 6. Visualizing outputs (Kotlin/Java)

Finally, we should talk about visualising data. The `rust` API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built. Kotlin, by contrast supports only some features. Fortunately these features are not used/covered in the `rust` tutorial either, so as to keep the walkthrough short and to-the-point.

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
