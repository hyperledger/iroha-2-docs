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
    //First we need to define a domain id (name)
    let domain_id = DomainId::new("disneyland".parse().unwrap());
    //Then we need to define a new domain object
    let domain: NewDomain = Domain::new(domain_id);
    //After, define a Register expression for the new domain
    let expression = RegisterExpr::new(domain);
    //And finally we need to send the transaction
    iroha_client.submit_blocking(expression).unwrap();
```