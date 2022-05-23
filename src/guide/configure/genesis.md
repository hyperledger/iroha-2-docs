# Genesis Block

The genesis block is the first block in your blockchain. It's never empty,
even if `configs/peer/genesis.json` is. We recommend adding at least one
more account to the genesis block; in our case, it was _alice_@wonderland,
which has the public key
`ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0` .
Think of it as the password used to "log in" as _alice_. _Also note,
**Iroha is case-sensitive,** meaning that **Alice@wonderland is different
from alice@wonderland.**_ It should go without saying that
_alice@wonderland_ is not the same as _alice@looking_glass_ either.

::: details Genesis Block

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
