---
title: "Revoke Roles | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to revoke roles from accounts in Iroha."
  - - meta
    - name: keywords
      content: "revoking roles, roles, permission groups"
---

# How to Revoke Roles

```rust
fn revoke_role(
    iroha: &Client,
) {
    // given that Alice has the role, revoke it
    let revoke_role = Revoke::role(
        RoleId::from_str("DOMAIN_DESTROYER"),
        AccountId::from_str("alice@wonderland").unwrap()
    );
    iroha.submit(revoke_role).unwrap();
}
```
