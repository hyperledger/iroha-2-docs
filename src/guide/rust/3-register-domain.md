# 3. Registering a Domain (Rust)

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

Note that we use `RegisterBox` and `IdentifiableBox` . Despite what your instincts as a `rust` developer might suggest, we're not actually using any kind of dynamic dispatch. There's no `dyn` anywhere, and `RegisterBox` isn't an alias for `Box<dyn Register>`.

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
