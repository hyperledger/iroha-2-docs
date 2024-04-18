---
title: "Register Domains | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register domains in Iroha."
  - - meta
    - name: keywords
      content: "Iroha domains, registering domains"
---

# How to Register a Domain

```rust
fn register_domain(iroha: &Client) {
    let wonderland = DomainId::from_str("wonderland").unwrap();
    let register_wonderland = Register::domain(
        Domain::new(wonderland)
    );
    iroha.submit(register_wonderland).unwrap();
}
```