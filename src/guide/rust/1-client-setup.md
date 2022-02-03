# 1. Iroha 2 Client Setup (Rust)

In this part we shall cover the main things to look out for if you want to use Iroha 2. Instead of providing the complete basics, we shall assume knowledge of the most widely used concepts, explain what’s unusual about Iroha 2 specifically, and provide a step-by-step guide to creating your own `rust` client for it.

We assume that you know how to create a new package, and have basic understanding of the fundamental `rust` code: `async` functions, `enum` types, traits and borrowing/ownership, as well as usage of the libraries that we also use: `serde`, `tokio`, `tracing` etc. If you don't feel comfortable with any of the above, we recommend consulting [the Rust book](https://doc.rust-lang.org/stable/book/) and [docs.rs](https://docs.rs/).

Iroha 2 makes extensive use of [workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html) (or crates), that go in a domain-first order. What that means is that instead of having a global _constants_ crate, we have a crate for the blockchain data model (`iroha_data_model`), a crate with cryptographic primitives `iroha_crypto` and so on. These, _individually_ have a module for constants.

If you add `iroha_client` to the other two crates, you get the minimum number of dependencies to start your own client, similar to `iroha_client_cli`. We expect to create a package on [crates.io](https://crates.io/), with all the documentation once the initial `v2.0.0` release is complete. In the meantime, you could use the local copy that you've just created in the [previous step](/guide/0-build-and-install) as a local installation in your client’s `Cargo.toml`.

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
