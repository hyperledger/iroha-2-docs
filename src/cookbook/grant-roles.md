---
title: "Grant Roles | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to grant roles to accounts in Iroha."
  - - meta
    - name: keywords
      content: "granting roles, roles, permission groups"
---

# How to Grant a Role

Roles are granted to accounts:

```rust
fn grant_role(
    iroha: &Client,
) {
    let grant_role = Grant::role(
        RoleId::from_str("DOMAIN_DESTROYER"),
        AccountId::from_str("alice@wonderland").unwrap()
    );
    iroha.submit(grant_role).unwrap();
}
```
