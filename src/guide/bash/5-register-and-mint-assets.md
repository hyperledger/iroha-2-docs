# 5. Registering and minting assets (Bash)

**In order to mint assets, you need to register the asset first. We are going to register the _tea_ token within the _looking_glass_ network, to do that we will run**

```bash
./iroha_client_cli asset register \
    --id="tea#looking_glass" \
    --value-type=Quantity
```

The _tea_ asset is now registered within the _looking_glass_ network, the output within the CLI is the same as with other commands, you will be able to see that there are new events in the pipeline.

With the asset created, now tokens need to be minted. Run:

```bash
./iroha_client_cli asset mint \
    --account="mad_hatter@looking_glass" \
    --asset="tea#looking_glass" \
    --quantity="100"
```

After minting one hundred _tea_, you will see more pipeline events in the logger, and you can also query the assets that you have just minted:

```bash
./iroha_client_cli asset list all
```

After running this command, you will be able to see the tokens currently available on the network:

```rust
[
    Asset {
        id: Id {
            definition_id: DefinitionId {
                name: "tea",
                domain_name: "looking_glass",
            },
            account_id: Id {
                name: "mad_hatter",
                domain_name: "looking_glass",
            },
        },
        value: Quantity(
            100,
        ),
    },
    Asset {
        id: Id {
            definition_id: DefinitionId {
                name: "rose",
                domain_name: "wonderland",
            },
            account_id: Id {
                name: "alice",
                domain_name: "wonderland",
            },
        },
        value: Quantity(
            13,
        ),
    },
]
```

Iroha 2 currently doesn't validate the account names, so you could (in theory) add invalid characters to the name, like e.g. spaces. **We recommend sticking to English alphanumeric characters and underscores**.
