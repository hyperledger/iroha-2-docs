---
title: "Register Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register assets in Iroha."
  - - meta
    - name: keywords
      content: "registering assets"
---

# How to Register an Asset

```rust
fn register_store_asset(
    iroha: &Client,
) {
    let hat_of_alice = "hat##alice@wonderland".parse::<AssetId>().unwrap();
    let hat_data = {
        // hat has at most 3 keys, each value must fit into 100 bytes
        let (data, limits) = (Metadata::new(), MetadataLimits::new(3, 100));
        data.insert_with_limits(
            "color".parse::<Name>().unwrap(),
            "yellow".to_owned(),
            limits,
        )
        .unwrap();
        data
    };
    // register a hat as Alice's asset
    let register_hat_of_alice = Register::asset(
        Asset::new(hat_of_alice, AssetValue::Store(hat_data))
    );
    iroha.submit(register_hat_of_alice).unwrap();
}
```

```rust
fn register_numeric_asset(
    iroha: &Client,
) {
    let roses_of_alice = "rose##alice@wonderland".parse::<AssetId>().unwrap();
    // register 123 roses as Alice's asset
    let register_roses_of_alice = Register::asset(
        Asset::new(roses_of_alice, numeric!(123))
    );
    iroha.submit(register_roses_of_alice).unwrap();
}
```