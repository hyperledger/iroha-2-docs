---
title: "Grant Permissions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to grant permissions in Iroha."
  - - meta
    - name: keywords
      content: "granting permissions, permission tokens"
---

# How to Grant Permissions

Granting a permission to an account:

```rust
fn grant_permission_to_account(
    iroha: &Client,
) {
    // Alice will be given permission to unregister the kingdom domain
    let grant_permission_to_unregister_kingdom = Grant::permission(
        PermissionToken::new(
            "CanUnregisterDomain".parse().unwrap(),
            &json!({ "domain_id": "kingdom" }),
        ),
        AccountId::from_str("alice@wonderland").unwrap()
    );
    iroha.submit(grant_permission_to_unregister_kingdom).unwrap();
}
```

Granting a permission to a role:

```rust
fn grant_permission_to_role(
    iroha: &Client,
) {
    // all accounts with the DOMAIN_DESTROYER role
    // will be able to unregister the kingdom domain
    let grant_permission_to_unregister_kingdom = Grant::role_permission(
        PermissionToken::new(
            "CanUnregisterDomain".parse().unwrap(),
            &json!({ "domain_id": "kingdom" }),
        ),
        RoleId::from_str("DOMAIN_DESTROYER").unwrap(),
    );
    iroha.submit(grant_permission_to_unregister_kingdom).unwrap();
}
```
