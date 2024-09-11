---
title: "Unregister Domains | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to unregister domains in Iroha."
  - - meta
    - name: keywords
      content: "Iroha domains, unregister instruction"
---

# How to Unregister a Domain

```rust
fn unregister_domain(iroha: &Client) {
    let wonderland = "wonderland".parse::<DomainId>().unwrap();
    let unregister_wonderland = Unregister::domain(wonderland);
    iroha.submit(unregister_wonderland).unwrap();
}
```