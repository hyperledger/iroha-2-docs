---
title: "Revoke Permissions | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to revoke permissions in Iroha."
  - - meta
    - name: keywords
      content: "revoking permissions, permission tokens"
---

# How to Revoke Permissions

```rust
fn revoke_permission_from_account(
    iroha: &Client,
) {
    let revoke_permission_to_unregister_kingdom = Revoke::permission(
        PermissionToken::new(
            "CanUnregisterDomain".parse().unwrap(),
            &serde_json::json!({ "domain_id": "kingdom" }),
        ),
        "alice@wonderland".parse::<AccountId>().unwrap()
    );
    iroha.submit(revoke_permission_to_unregister_kingdom).unwrap();
}
```

```rust
fn revoke_permission_from_role(
    iroha: &Client,
) {
    let revoke_permission_to_unregister_kingdom = Revoke::role_permission(
        PermissionToken::new(
            "CanUnregisterDomain".parse().unwrap(),
            &serde_json::json!({ "domain_id": "kingdom" }),
        ),
        "DOMAIN_DESTROYER".parse::<RoleId>().unwrap(),
    );
    iroha.submit(revoke_permission_to_unregister_kingdom).unwrap();
}
```
