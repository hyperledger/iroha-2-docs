# Rust Guide

## 1. Iroha 2 Client Setup

In this part we shall cover the process of using the Iroha 2 Rust
libraries. Instead of providing the complete basics, we shall assume
knowledge of the most widely used concepts, explain what's unusual about
Iroha 2 specifically, and provide a step-by-step guide to creating your own
Rust client for it.

We assume that you know how to create a new package and have basic
understanding of the fundamental Rust code; `async` functions, `enum`
types, traits and borrowing/ownership, as well as the libraries that we
use: `serde`, `tokio`, `tracing`, etc.

::: tip

If you don't feel comfortable with any of the above, we recommend
consulting [the Rust book](https://doc.rust-lang.org/stable/book/) and
[docs.rs](https://docs.rs/).

:::

Iroha 2 makes extensive use of
[workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html).
Currently, there are two workspaces, the one that contains the WASM support
library and the one that contains the core support libraries, which go in a
domain-first order. What that means is that instead of having a global
_constants_ crate, we have a crate for the blockchain data model
(`iroha_data_model`), a crate with cryptographic primitives
(`iroha_crypto`), and so on. These, _individually_, have a module for
constants.

If you add `iroha_client` to the other two crates, you get the minimum
number of dependencies to start your own client, similar to
`iroha_client_cli`.

Once the initial `v2.0.0` release is complete, we plan to create a package
on [crates.io](https://crates.io/) with all the documentation. In the
meantime, you could use the local copy that you've just created in the
[previous step](/guide/build-and-install) as a local installation in your
client's `Cargo.toml`:

```toml
[dependencies]
iroha_client = { version = "=2.0.0-pre-rc.4", path = "~/Git/iroha/client" }
iroha_data_model = { version = "=2.0.0-pre-rc.4", path = "~/Git/iroha/data_model" }
iroha_crypto = { version = "=2.0.0-pre-rc.4", path = "~/Git/iroha/crypto" }
```

The added benefit of using a local copy is that you have access to the
minimal BFT network in the form of `docker-compose.yml`, which allows you
to experiment. The drawbacks are mitigated by the fact that Rust links
statically by default, so we recommend you experiment with the local set up
first.

::: info

You could also make use of our `test_network` crate, which is available via
[GitHub](https://github.com/hyperledger/iroha/tree/iroha2/core/test_network)
but not via crates.io.

:::

You would also benefit from having immediate access to the example
configurations in the `~/Git/iroha/configs` folder.

So let's copy the example client configuration somewhere useful:

```bash
cp -vfr ~/Git/iroha/configs/client_cli/config.json example/config.json
```

We recommend looking through it to familiarise yourself with the key pieces
of information that every Iroha 2 client needs. Specifically, each client
operates on behalf of a pre-existing account. These accounts are identified
by a _name@domain_name_ ID and can only be accessed provided that you know
their specific key.

## 2. Configuring Iroha 2

Your application written in Rust needs to instantiate a client. The client
typically needs specific configuration options, which you could either
generate or load from the provided `config.json`. Let's do that now:

```rust
use iroha_client::config::Configuration as ClientConfiguration;

let cfg: ClientConfiguration = serde_json::from_reader(file)?;
```

Using said configuration, instantiate a client:

```rust
use iroha_client::client::Client;

let iroha_client = Client::new(cfg)?;
```

Note that it used to be necessary to create a mutable client. Sending and
receiving messages affects the client's internal state, but now that state
is hidden behind interior mutable smart pointers.

Of course, depending on your application, you might want to de-serialise
your `ClientConfiguration` structure from a different location. Perhaps,
you might want to build the configuration in place using the command-line
arguments, or perhaps, you're using the XDG specification to store the file
persistently in a different location. For this purpose, it's useful to try
and construct an instance of `ClientConfiguration`:

```rust
use iroha_core::prelude::*;
use iroha_data_model::prelude::*;

let kp = KeyPair::new(
    PublicKey::from_str(
        r#"ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"#,
    )?,
    PrivateKey::from_hex(
        Algorithm::Ed25519,
        "9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0"
            .into(),
    )?
)?;

let (public_key, private_key) = kp.clone().into();
let account_id: AccountId = "alice@wonderland".parse()?;

let cfg = ClientConfiguration {
    public_key,
    private_key,
    account_id,
    torii_api_url: SmallStr::from_string(iroha_config::torii::uri::DEFAULT_API_URL.to_owned()),
    ..ClientConfiguration::default()
};
```

There are a few things that may prove confusing.

If you look at the `config.json`, you'll see that the keys are given in
[multi-hash format](https://github.com/multiformats/multihash). If you've
never worked with multi-hash before, it is natural to assume that the
right-hand-side is not a hexadecimal representation of the key bytes (two
symbols per byte), but rather the bytes encoded as ASCII (or UTF-8), and
call `from_hex` on the string literal in both the `public_key` and
`private_key` instantiation.

It is also natural to assume that calling `PrivateKey::try_from_str` on the
string literal would yield only the correct key. So if you get the number
of bits in the key wrong, e.g. 32 bytes vs 64, that it would raise an error
message.

**Both of these assumptions are wrong.** Unfortunately, the error messages
don't help in de-bugging this particular kind of failure.

**How to fix**: use `hex_literal`. This will also turn an ugly string of
characters into a nice small table of obviously hexadecimal numbers.

::: warning

Even the `try_from_str` implementation cannot verify if a given string is a
valid `PrivateKey` and warn you if it isn't.

It will catch some obvious errors, e.g. if the string contains an invalid
symbol. However, since we aim to support many key formats, it can't do much
else. It cannot tell if the key is the _correct_ private key _for the given
account_ either, unless you submit an instruction.

:::

These sorts of subtle mistakes can be avoided, for example, by
deserialising directly from string literals, or by generating a fresh
key-pair in places where it makes sense.

## 3. Registering a Domain

Registering a domain is a relatively easy operation. Most of the
boilerplate code has to do with setting up the Iroha 2 client and
deserialising its configuration. To register a domain, you need the domain
name;

```rust
use iroha_data_model::prelude::*;

let looking_glass: DomainId = "looking_glass".parse()?;
```

Which we convert into an instruction:

```rust

let create_looking_glass = RegisterBox::new(Domain::new(looking_glass.clone()));
```

Note that we use `RegisterBox` and `IdentifiableBox`. Despite what your
instincts as a Rust developer might suggest, we're not actually using any
kind of dynamic dispatch. There's no `dyn` anywhere, and `RegisterBox`
isn't an alias for `Box<dyn Register>`.

A `RegisterBox` is a specialised `enum` that uses static dispatch to
achieve what looks like dynamic dispatch, without any heap allocation. If
you want to add more types to `RegisterBox` you must either open an issue
on GitHub, or do that by yourself on a local fork of Iroha.

The instruction is then batched into a transaction:

```rust
let tx = iroha_client.build_transaction([create_looking_glass], Metadata::default())?;
```

Which is then submitted into the pipeline:

```rust
iroha_client.submit_transaction(tx)?;
```

Note the question mark here. This will return an `Err` variant if there's
something immediately and obviously wrong with the transaction: for
example, if it couldn't submit the transaction to the peer (e.g. there's no
connection), or if the transaction got rejected with an error. The cost is
that the `submit_transaction` function is synchronous.

We could have also done the following:

```rust
iroha_client.submit_with_metadata(create_looking_glass, Metadata::default())?;
```

or

```rust
iroha_client.submit(create_looking_glass)?;
```

The latter style is just syntactic sugar. Every submission comes in the
form of a transaction that has metadata.

While the latter is a convenient shorthand that we shall use frequently, we
strongly advise using explicit construction in production code.

::: info

It is likely that we shall replace most if not all instances of `submit` in
our code base with explicit transactions.

<!-- Check: a reference about future releases or work in progress -->

:::

## 4. Registering an Account

Registering an account is a bit more involved than registering a domain.
With a domain, the only concern is the domain name. However, with an
account, there are a few more things to worry about.

First of all, we need to create an `AccountId`. Note that we can only
register an account to an existing domain. The best UX design practices
dictate that you should check if the requested domain exists _now_, and if
it doesn't, suggest a fix to the user. After that, we can create a new
account named _white_rabbit_.

```rust
let longhand_id = iroha_data_model::account::Id {
    name: "white_rabbit".parse()?,
    domain_name: "looking_glass".parse()?,
};

let account_id: AccountId = "white_rabbit@looking_glass".parse();
assert_eq!(longhand_id, id);
```

Second, you should provide the account with a public key. It is tempting to
generate both it and the private key at this time, but it isn't the
brightest idea. Remember, that _the white_rabbit_ trusts _you,
alice@wonderland_, to create an account for them in the domain
\_looking_glass, **but doesn't want you to have access to that account
after creation**.

If you gave _white_rabbit_ a key that you generated yourself, how would
they know if you don't have a copy of their private key? Instead, the best
way is to **ask** _white_rabbit_ to generate a new key-pair, and give you
the public half of it:

```rust
let key: PublicKey = get_key_from_white_rabbit();
```

Only then do we build an instruction from it:

```rust
let create_account =
    RegisterBox::new(IdentifiableBox::from(NewAccount::with_signatory(id, key)));
```

Which is then **wrapped in a transaction** and **submitted to the peer** as
[in the previous section](#_3-registering-a-domain).

## 5. Registering and minting assets

Iroha has been built with few [underlying assumptions](./objects/assets.md)
about what the assets need to be in terms of their value type and
characteristics (fungible or non-fungible, mintable or non-mintable).

To register an asset, we first construct an
`iroha_data_model::asset::DefinitionId` like so:

```rust
let id = AssetDefinitionId::from_str("time#looking_glass")?;
```

::: info

Note that we use `#` symbol to separate the name of the asset from the
domain to which it belongs. This is intentional. This reflects the rule
that there can be many `alice`s in many domains, with only one `alice` per
domain, and there can be an asset that is also named `alice`, but there can
be only one, regardless of type.

:::

Then construct an instruction:

```rust
let register_time = RegisterBox::new(AssetDefinition::fixed(id).mintable_once());
iroha_client.submit(register_time)?;
```

This creates an asset `time` that can only be minted once and has the type
`fixed`. `AssetDefinition::fixed` just like its other cousins (`quantity`
and `big_quantity`) returns a builder of an `AssetDefinition`.

This asset is `mintable_once`, which means that the next time we mint it,
we have to specify the entire amount that is going to exist for the rest of
the existence of the blockchain.

```rust
let mint = MintBox::new(
    Value::Fixed(12.34_f64.try_into()?),
    IdBox::AssetId(AssetId::new(
        id.clone(),
        account_id.clone()
    ))
);
iroha_client.submit(mint)?;
```

Now imagine that the `white_rabbit@looking_glass` was not very keen and
didn't notice that he wanted `123.4_f64` as the amount of time. Now white
rabbit notices the problem and thinks "oh dear, not a lot of time has
passed, perhaps I can give myself some more", and submits another mint
request with `111.06_f64` instead of the original `12.34_f64`. But, alas,
no such luck. The white rabbit cannot mint more time and is thus
perpetually late.

Roses, by contrast, are already registered in the network during the
genesis round, and belong to _alice@wonderland_. Moreover, when they were
registered, we didn't add the restriction, so we can mint them again and
again as _alice_:

```rust
let mint_roses = MintBox::new(
    Value::U32(42),
    IdBox::AssetId(AssetId::new(roses.clone(), alice.clone())),
);
```

Which we then submit as usual.

::: info

Our assets are strongly typed. As such, when you create a `MintBox`, you
need to check that the asset has the correct underlying type. If you don't
know the type, query it. This is also why we specifically annotate
numerical literals with their type.

Contrary to what you might think, this restriction isn't just for pedantry.
Implicit conversion errors are the bane of all programmers, if you got the
_AssetValueType_ incorrect, _how do you know that it was the only mistake
in that transaction?_

:::

## 6. Burning assets

Burning assets is quite similar to minting. First, you crete the burn
instruction indicating which asset to burn and its quantity. Then submit
this instruction.

```rust
let burn_roses = BurnBox::new(
    Value::U32(10),
    IdBox::AssetId(AssetId::new(
        roses.clone(),
        alice.clone()
    ))
);
iroha_client.submit(burn_roses)?;
```

## 7. Visualising outputs

Finally, we should talk about visualising data. The Rust API is currently
the most complete in terms of available queries and instructions. After
all, this is the language in which Iroha 2 was built.

We shall, however, leave most of the aforementioned advanced features down
the rabbit hole, up to the reader's own devices to discover. This document
can easily get out of sync with the state of the API features. By contrast,
the online documentation is always up to date. Plus a short tutorial
wouldn't be able to do all these features justice. Instead, we shall retain
parity with other language tutorials and introduce you to pipeline filters.

There are two possible event filters: `PipelineEventFilter` and
`DataEventFilter`, we shall focus on the former. This filter sieves events
pertaining to the process of submitting a transaction, executing a
transaction, and committing it to a block.

First, let's build a filter:

```rust
use iroha_data_model::prelude::*;

let filter = FilterBox::Pipeline(PipelineEventFilter::identity());
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

Needless to say, an synchronous infinite blocking loop is bad UX for
anything but a command-line program, but for illustration purposes, this
would create a nice printout, just like in `iroha_client_cli`.
