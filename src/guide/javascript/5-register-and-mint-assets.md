# 5. Registering and minting assets (JavaScript)

Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be. The assets can be fungible (every £1 is exactly the same as every other £1), or non-fungible (a £1 bill signed by the Queen of Hearts is not the same as a £1 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block). Additionally, the assets have different underlying value types.

Specifically, we have `AssetValueType::Quantity` which is effectively an unsigned 32-bit integer, a `BigQuantity` which is an unsigned 128 bit integer, which is enough to trade all possible IPV6 addresses, and quite possibly individual grains of sand on the surface of the earth and `Fixed`, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. It doesn't quite use binary-coded decimal for performance reasons. All three types can be registered as either **mintable** or **non-mintable**.

In JS, you can create a new asset with the following instruction:

```ts
const time = AssetDefinition.defineUnwrap({
  value_type: AssetValueType.variantsUnwrapped.Quantity,
  id: {
    name: 'time',
    domain_name: 'looking_glass',
  },
  metadata: { map: new Map() },
  mintable: false,
})

const register = RegisterBox.defineUnwrap({
  object: {
    expression: Expression.variantsUnwrapped.Raw(
      Value.variantsUnwrapped.Identifiable(
        IdentifiableBox.variantsUnwrapped.AssetDefinition(time),
      ),
    ),
  },
})
```

Pay attention to that we have defined the asset as `mintable: false`. What this means is that we cannot create more of `time`. The late bunny will always be late, because even the super-user of the blockchain cannot mint more of `time` than already exists in the genesis block.

This means that no matter how hard the _late_bunny_ tries, the time that he has is the time that was given to him at genesis. And since we haven’t defined any time in the domain _looking_glass at_ genesis and defined time in a non-mintable fashion afterwards, the _late_bunny_ is doomed to always be late.

We can however mint a pre-existing `mintable: true` asset that belongs to Alice.

```ts
const mint = MintBox.defineUnwrap({
  object: {
    expression: Expression.variantsUnwrapped.Raw(
      Value.variantsUnwrapped.U32(42),
    ),
  },
  destination_id: {
    expression: Expression.variantsUnwrapped.Raw(
      Value.variantsUnwrapped.Id(
        IdBox.variantsUnwrapped.AssetDefinitionId({
          name: 'roses',
          domain_name: 'wonderland',
        }),
      ),
    ),
  },
})
```

Again it should be emphasised that an Iroha 2 network is strongly typed. You need to take special care to make sure that only unsigned integers are passed to the `Value.variantsUnwrapped.U32` factory method. Fixed precision values also need to be taken into consideration. Any attempt to add to or subtract from a negative Fixed-precision value will result in an error.
