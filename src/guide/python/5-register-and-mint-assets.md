# 5. Registering and minting assets (Python 3)

Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be. The assets can be fungible (every £1 is exactly the same as every other £1), or non-fungible (a £1 bill signed by the Queen of Hearts is not the same as a £1 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block). Additionally, the assets have different underlying value types.

Asset creation is by far the most cumbersome.

```python
import iroha2.data_model.asset as asset

time = asset.Definition(
    value_type=asset.ValueType.Quantity,
    id=asset.DefinitionId(name="time", domain_name="looking_glass"),
    metadata={},
    mintable=False
)
```

Note the following. First, we used the `**kwargs` syntax to make everything more explicit.

We have a `value_type` which must be specified. Python is duck-typed, while `rust` isn’t. Make sure that you track the types diligently, and make use of `mypy` annotations. The `Quantity` value type is an internal 32-bit unsigned integer. Your other options are `BigQuantity` which is a 128-bit unsigned integer and `Fixed`. All of these are unsigned. Any checked operation with a negative `Fixed` value (one that you got by converting a negative floating-point number), will result in an error.

Continuing the theme of explicit typing, the `asset.DefinitionId` is its own type. We could have also written `asset.DefinitionId.parse("time#looking_glass")`, but making sure that you know what’s going on is more useful in this case. Here, the `metadata` is an empty dictionary. We won’t go much into metadata, because it is out of the scope of this tutorial.

Finally, we have `mintable`. By default this is set to `True`, however, setting it to `False` means that any attempt to mint more of `time#looking_glass` is doomed to fail. Unfortunately, since we didn’t add any `time` at genesis, the _late_bunny_ will never have time. There just isn’t any in his domain, and more can’t be minted.

OK. So how about a mint demonstration? Fortunately, _alice@wonderland_ has an asset called _roses#wonderland,_ which can be minted. For that we need to do something much simpler.

```python
amount = Expression(Value(U32(42)))
destination = Expression(Value(Identifiable(asset.DefinitionId.parse("rose#wonderland"))))
mint_amount = Mint(amount, destination)
cl.submit_isi(mint_amount)
```

Which would add `42` to the current tally of roses that Alice has.
