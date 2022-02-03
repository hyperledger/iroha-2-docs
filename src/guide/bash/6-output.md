# 6. Visualizing outputs (Bash)

Although you will get a constant data feed of the network within the terminal running docker compose, you can also configure an output to listen to events on the network.

From a terminal tab/window run

```bash
./iroha_client_cli events pipeline
```

This view will output all the events related to Iroha 2, such as transactions, block validations, or data events, such as when the in-memory representation of the blockchain gets committed to the hard disk.

The output would look like this:

```rust
Iroha Client CLI: build v0.0.1 [release]
User: alice@wonderland
{"PUBLIC_KEY":"ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0","PRIVATE_KEY":{"digest_function":"ed25519","payload":"9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"},"ACCOUNT_ID":{"name":"alice","domain_name":"wonderland"},"TORII_API_URL":"http://127.0.0.1:8080","TORII_STATUS_URL":"127.0.0.1:8180","TRANSACTION_TIME_TO_LIVE_MS":100000,"TRANSACTION_STATUS_TIMEOUT_MS":10000,"MAX_INSTRUCTION_NUMBER":4096,"ADD_TRANSACTION_NONCE":false,"LOGGER_CONFIGURATION":{"MAX_LOG_LEVEL":"INFO","TELEMETRY_CAPACITY":1000,"COMPACT_MODE":false,"LOG_FILE_PATH":null}}
Listening to events with filter: Pipeline(EventFilter { entity: None, hash: None })
Pipeline(
    Event {
        entity_type: Transaction,
        status: Validating,
        hash: 10fadf7b7fb8036d00bbd8cadc5358193b04ad6573537463acef2091ba4d0e77,
    },
)
Pipeline(
    Event {
        entity_type: Block,
        status: Validating,
        hash: 944269f27e1ed8882c6c8c74bd641bc3551ef5651320f4e1e1be11a470b4e3c3,
    },
)
Pipeline(
    Event {
        entity_type: Transaction,
        status: Committed,
        hash: 10fadf7b7fb8036d00bbd8cadc5358193b04ad6573537463acef2091ba4d0e77,
    },
)
```
