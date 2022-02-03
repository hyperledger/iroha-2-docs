# 2. Configuring Iroha 2 (Rust)

Your application written in `rust` needs to instantiate a client. The client, typically needs specific configuration options, which you could either generate, or load from a the provided `config.json`. Let's do that now:

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

**TODO fix code formatting**.

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
