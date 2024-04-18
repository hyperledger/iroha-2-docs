---
title: "Unregister Assets | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to unregister assets in Iroha."
  - - meta
    - name: keywords
      content: "Iroha assets, unregister instruction"
---

# How to Unregister an Asset

```rust
fn unregister_asset(
    iroha: &Client,
) {
    let roses_of_alice = AssetId::from_str("rose##alice@wonderland").unwrap();
    let unregister_roses_of_alice = Unregister::asset(roses_of_alice);
    iroha.submit(unregister_roses_of_alice).unwrap();
}
```