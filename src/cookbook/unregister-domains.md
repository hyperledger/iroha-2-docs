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
    //First we need to define a domain id (name) that we want to unregister
    let domain_id = DomainId::new("disneyland".parse().unwrap());
    //Then we need to define an Unregister expression for the domain
    let expression = UnregisterExpr::new(domain_id);
    //And finally we need to send the transaction
    iroha_client.submit_blocking(expression).unwrap();
```