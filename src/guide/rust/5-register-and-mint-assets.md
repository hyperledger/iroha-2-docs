# 5. Registering and minting assets (Rust)

Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn't the brightest idea. Remember*,* that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? **Instead, the best way is to **ask\*\* _late_bunny_ to generate a new key-pair, and give you the public half of it.

Specifically, we have `iroha_data_model::AssetValueType::Quantity` which is effectively an unsigned 32-bit integer, a `BigQuantity` which is an unsigned 128 bit integer, which is enough to trade all possible IPV6 addresses, and quite possibly individual grains of sand on the surface of the earth and `Fixed`, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. It doesn't quite use binary-coded decimal for performance reasons. All three types can be registered as either **mintable** or **non-mintable**.

Now, let's get back to coding. To register an asset, we first construct an `iroha_data_model::asset::DefinitionId` like so:

```rust
use iroha_data_model::assset::DefinitionId;

let id = DefinitionId {
	name: "time".to_owned(),
  domain_name: "looking_glass".to_owned(),
};
```

Then construct an instruction

```rust
let register_time = RegisterBox::new(IdentifiableBox::AssetDefinition(AssetDefinition::new(
    id,
    AssetValueType::Fixed,
    false // If only we could mint more time.
)));
```

For technical reasons, this would (_for now_) create a completely useless asset. In order to mint, one must already have an asset definition in the blockchain. A non-mintable asset definition, however cannot be minted by definition.

This means that no matter how hard the _late_bunny_ tries, the time that he has is the time that was given to him at genesis. And since we haven’t defined any time in the domain _looking_glass at_ genesis and defined time in a non-mintable fashion afterwards, the _late_bunny_ is doomed to always be late.

Roses, by contrast are already registered in the network during the genesis, and belong to _alice@wonderland, so_ we can mint them without much trouble. Let's prepare some data:

```rust
let roses = DefinitionId {
	name: "roses".to_owned(),
  domain_name: "wonderland".to_owned(),
};
let alice = iroha_data_model::account::Id {
  name: "alice".to_owned(),
  domain_name: "wonderland".to_owned(),
};
```

And build an instruction:

```rust
use iroha_data_model::prelude::*;

let mint_roses = MintBox::new(
	Value::U32(42),
  IdBox::AssetId(iroha_data_model::asset::Id::new(roses, alice)),
);
```

Which we then submit as usual. Make sure that the asset has the right type. Roses are a `Quantity`. You would think that it would also be possible to mint `rose`s if they were `BigQuantity` or `Fixed`, using `Value::U32`, but you'd be wrong.

Contrary to what you might think, this restriction isn't just for pedantry. Implicit conversion errors are the bane of all programmers, if you got the _AssetValueType_ incorrect, _how do you know that it was the only mistake in that transaction?_
