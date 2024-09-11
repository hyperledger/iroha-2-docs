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
        "DOMAIN_DESTROYER".parse::<RoleId>().unwrap(),
        "alice@wonderland".parse::<AccountId>().unwrap()
    );
    iroha.submit(revoke_role).unwrap();
}
```
