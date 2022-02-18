# Rust guide

## 1. Iroha 2 Client Setup

In this part we shall cover the main things to look out for if you want to use Iroha 2. Instead of providing the complete basics, we shall assume knowledge of the most widely used concepts, explain what’s unusual about Iroha 2 specifically, and provide a step-by-step guide to creating your own Rust client for it.

We assume that you know how to create a new package, and have basic understanding of the fundamental Rust code: `async` functions, `enum` types, traits and borrowing/ownership, as well as usage of the libraries that we also use: `serde`, `tokio`, `tracing` etc. If you don't feel comfortable with any of the above, we recommend consulting [the Rust book](https://doc.rust-lang.org/stable/book/) and [docs.rs](https://docs.rs/).

Iroha 2 makes extensive use of [workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html) (or crates), that go in a domain-first order. What that means is that instead of having a global _constants_ crate, we have a crate for the blockchain data model (`iroha_data_model`), a crate with cryptographic primitives `iroha_crypto` and so on. These, _individually_ have a module for constants.

If you add `iroha_client` to the other two crates, you get the minimum number of dependencies to start your own client, similar to `iroha_client_cli`. We expect to create a package on [crates.io](https://crates.io/), with all the documentation once the initial `v2.0.0` release is complete. In the meantime, you could use the local copy that you've just created in the [previous step](/guide/build-and-install) as a local installation in your client’s `Cargo.toml`.

```toml
[dependencies]
iroha_client = { version = "=2.0.0-pre.1", path = "~/Git/iroha/client" }
iroha_data_model = { version = "=2.0.0-pre.1", path = "~/Git/iroha/data_model" }
iroha_crypto = { version = "=2.0.0-pre.1", path = "~/Git/iroha/crypto" }
```

The added benefit of using a local copy, is that you have access to the minimal BFT network in the form of `docker-compose.yml`.

::: info

You could also make use of our `test_network` crate, which is available via GitHub, but not [crates.io](https://crates.io/).

:::

You would also benefit from having immediate access to the example configurations in the `~/Git/iroha/configs` folder.

So let’s copy the example client configuration somewhere useful.

```bash
cp -vfr ~/Git/iroha/configs/client_cli/config.json example/config.json
```

You should look through it, to familiarise with the key pieces of information that every Iroha 2 client needs. Specifically, each client operates on behalf of a pre-existing account. These accounts are identified by a _name@domain_name_ ID and can only be accessed provided that you know their specific key.

## 2. Configuring Iroha 2

Your application written in Rust needs to instantiate a client. The client, typically needs specific configuration options, which you could either generate, or load from a the provided `config.json`. Let's do that now:

```rust
use iroha_clientconfig::Configuration as ClientConfiguration;

let cfg = serde_json::from_reader(file)?;
```

Using that configuration, it should be straightforward to instantiate a basic client.

```rust
use iroha_client::client::Client;

let mut iroha_client = Client::new(cfg);
```

Note that we have created a mutable client. Sending and receiving messages affects the client's internal state.

Of course, depending on your application, you might want to de-serialise your `MyConfiguration` structure from a different location. Perhaps, you might want to build the configuration in place using the command-line arguments, or perhaps, you're using the XDG specification to store the file persistently in a different location. For this purpose, it's useful to try and construct the `ClientConfiguration`.

```rust
use iroha_core::prelude::*;
use iroha_data_model::prelude::*;

let kp = KeyPair {
    public_key: PublicKey::from_str(
        r#"ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"#,
    )
    .unwrap(),
    private_key: PrivateKey {
        digest_function: "ed25519".to_string(),
        payload: hex_literal::hex!(
            "
            9AC47ABF 59B356E0
            BD7DCBBB B4DEC080
            E302156A 48CA907E
            47CB6AEA 1D32719E
            7233BFC8 9DCBD68C
            19FDE6CE 61582252
            98EC1131 B6A130D1
            AEB454C1 AB5183C0
            "
        )
        .into(),
    },
};

let (public_key, private_key) = kp.clone().into();
let account_id = AccountId {
    name: "alice".to_owned(),
    domain_name: "wonderland".to_owned(),
};
let cfg = ClientConfiguration {
    public_key,
    private_key,
    account_id,
    torii_api_url: iroha_data_model::uri::DEFAULT_API_URL.to_owned(),
    ..ClientConfiguration::default()
};
```

::: info

There are a few things that may prove confusing. If you look at the `config.json`, you'll see that the keys are given in [multi-hash format](https://github.com/multiformats/multihash). If you’ve never worked with multi-hash before, it is natural to assume that the right-hand-side is not a hexadecimal representation of the key bytes (two symbols per byte), but rather the bytes encoded as ASCII (or UTF-8), and call `from_string` on the string literal in both the `public_key` and `private_key` instantiation.

It is also natural to assume that calling `PrivateKey::try_from_str` on the string literal would yield only the correct key. So if I get the number of bits in the key wrong, e.g. 32 bytes vs 64, that it would raise an error message.

**Both of these assumptions are wrong.** Unfortunately, the error messages don’t help in de-bugging this particular kind of failure.

**How to fix** — trivial: just use `hex_literal`. This will also turn an ugly string of characters into a nice small table of obviously hexadecimal numbers.

**BEWARE**: even the `try_from_str` implementation cannot verify if a given string is a valid `PrivateKey`, and warn you if it isn't. It will catch some obvious errors, like if the string contains an invalid symbol, but because we aim to support many key formats, it can’t do much else. It cannot tell if the key is the _correct_ private key _for the given account_ either, unless you submit an instruction.

These sorts of subtle mistakes can be avoided, by e.g. deserialising directly from string literals, or generating a fresh key-pair in places where it makes sense.

:::

## 3. Registering a Domain

Registering a domain is a relatively easy operation. Most of the boiler-plate code has to do with setting up the Iroha 2 client and deserialising its configuration. To register a domain, you need the domain name;

```rust
let looking_glass = iroha_data_model::domain::Domain::new("looking_glass");
```

Which we convert into an instruction

```rust
use iroha_data_model::isi::{RegisterBox, IdentifiableBox};

let create_looking_glass = RegisterBox::new(IdentifiableBox::from(looking_glass));
let metadata = iroha_data_model::metadata::UnlimitedMetadata::default();
```

Note that we use `RegisterBox` and `IdentifiableBox` . Despite what your instincts as a Rust developer might suggest, we're not actually using any kind of dynamic dispatch. There's no `dyn` anywhere, and `RegisterBox` isn't an alias for `Box<dyn Register>`.

A `RegisterBox` is a specialised `enum` that uses static dispatch to achieve what looks like dynamic dispatch, without any heap allocation. If you want to add more types to `RegisterBox` you must either open an issue on GitHub, or do that by yourself on a local fork of Iroha.

The instruction is then batched into a transaction

```rust
let tx = iroha_client.build_transaction(vec![instruction], metadata)?;
```

Which is then submitted into the pipeline.

```rust
iroha_client.submit_transaction(tx)?;
```

Note the question mark here. This will return an `Err` variant if there's something immediately and obviously wrong with the transaction, such as, if it couldn't submit the transaction to the peer (e.g. there's no connection), or if the transaction got rejected with an error. The cost is that the `submit_transaction` function is synchronous.

We could have also done the following:

```rust
iroha_client.submit(create_looking_glass);
```

This is done without attaching either any metadata or building a transaction. The latter style will lead to subtle errors, so until you know a bit more about Iroha, it might be a good idea not to do it.

## 4. Registering an Account

Registering an account is a bit more involved than registering a domain. With a domain, the only concern is the domain name, however, with an account, there are a few more things to worry about.

First of all, we need to create an `AccountId`. Note, that we can only register an account to an existing domain. The best UX design practices dictate that you should check if the requested domain exists _now_, and if it doesn’t — suggest a fix to the user. After that, we can create a new account, that we name _late_bunny._

```rust
let id = iroha_data_model::account::Id {
    name: "late_bunny",
    domain_name: "looking_glass"
};
```

Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn't the brightest idea. Remember, that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? Instead, the best way is to **ask** _late_bunny_ to generate a new key-pair, and give you the public half of it.

```rust
let key: PublicKey = get_key_from_late_bunny();
```

Only then do we build an instruction from it:

```rust
let create_account =
    RegisterBox::new(IdentifiableBox::from(NewAccount::with_signatory(id, key)));
```

Which is then **wrapped in a transaction** and **submitted to the peer** as [in the previous section](#_3-registering-a-domain).

## 5. Registering and minting assets

Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be. The assets can be fungible (every £1 is exactly the same as every other £1), or non-fungible (a £1 bill signed by the Queen of Hearts is not the same as a £1 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block). Additionally, the assets have different underlying value types.

Specifically, we have `AssetValueType::Quantity` which is effectively an unsigned 32-bit integer, a `BigQuantity` which is an unsigned 128 bit integer, which is enough to trade all possible IPV6 addresses, and quite possibly individual grains of sand on the surface of the earth and `Fixed`, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. It doesn't quite use binary-coded decimal for performance reasons. All three types can be registered as either **mintable** or **non-mintable**.

Now, let's get back to coding. To register an asset, we first construct an `iroha_data_model::asset::DefinitionId` like so:

```rust
use iroha_data_model::asset::DefinitionId;

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

## 6. Visualizing outputs

Finally, we should talk about visualising data. The Rust API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built.

We shall, however, leave most of the aforementioned advanced features down the rabbit hole, up to the reader's own devices to discover. This document can easily get out of sync with the state of the API features. By contrast, the online documentation is always up to date. Plus a short tutorial wouldn't be able to do all these features justice. Instead, we shall retain parity with other language tutorials and introduce you to pipeline filters.

There are two possible event filters: `PipelineEventFilter` and `DataEventFilter`, we shall focus on the former. This filter sieves events pertaining to the process of submitting a transaction, executing a transaction and committing it to a block.

First, let's build a filter

```rust
use iroha_data_model::prelude::*;

let filter = EventFilter::Pipeline(PipelineEventFilter::identity());
```

Then, we start listening for events in an infinite loop:

```rust
for event in iroha_client.listen_for_events(filter)? {
    match event {
        Ok(event) => println!("Success: {:#?}", event),
        Err(err) => println!("Sadness:( {:#?}",  err),
    }
};
```

**Needless to say that a synchronous infinite blocking loop is bad UX for anything but a command-line program**, but for illustration purposes, this would create a nice printout, just like in `iroha_client_cli`.
