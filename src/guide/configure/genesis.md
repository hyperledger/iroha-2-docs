# Genesis Block

The genesis block is the first block in your blockchain. It's never empty,
even if `configs/peer/genesis.json` is. We recommend adding at least one
more account to the genesis block.

In our case, it was _alice_@wonderland with the public key
`ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0`.
Think of it as the password used to "log in" as _alice_.

::: details Genesis Block Example: alice@wonderland

```json
{
  "transactions": [
    {
      "isi": [
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "Domain": {
                    "name": "wonderland",
                    "accounts": {},
                    "asset_definitions": {},
                    "metadata": {}
                  }
                }
              }
            }
          }
        },
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "NewAccount": {
                    "id": {
                      "name": "alice",
                      "domain_name": "wonderland"
                    },
                    "signatories": [
                      "ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"
                    ],
                    "metadata": {}
                  }
                }
              }
            }
          }
        },
        {
          "Register": {
            "object": {
              "Raw": {
                "Identifiable": {
                  "AssetDefinition": {
                    "id": {
                      "name": "rose",
                      "domain_name": "wonderland"
                    },
                    "value_type": "Quantity",
                    "metadata": {},
                    "mintable": true
                  }
                }
              }
            }
          }
        },
        {
          "Mint": {
            "object": {
              "Raw": {
                "U32": 13
              }
            },
            "destination_id": {
              "Raw": {
                "Id": {
                  "AssetId": {
                    "definition_id": {
                      "name": "rose",
                      "domain_name": "wonderland"
                    },
                    "account_id": {
                      "name": "alice",
                      "domain_name": "wonderland"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  ]
}
```

:::

::: info Note

Iroha is **case-sensitive**, meaning that _Alice_@wonderland is different
from _alice_@wonderland. It should go without saying that
_alice@wonderland_ is not the same as _alice@looking_glass_ either since
these accounts belong to different domains, `wonderland` and `looking_glass`.

:::