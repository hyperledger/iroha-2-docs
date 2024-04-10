---
title: "Register Roles | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to register roles in Iroha."
  - - meta
    - name: keywords
      content: "registering roles, permissions"
---

# How to Register a Role

The minimal case is an empty role (without any permission tokens):

```rust
fn register_new_role(
    role_name: &str, 
    iroha_client: &Client
) {
    let role_id = RoleId::from_str(role_name).unwrap();
    let role = iroha_data_model::role::Role::new(role_id);
    let register_role = Register::role(role);
    iroha_client.submit(register_role).unwrap();
}
```

Permission tokens may be added to a role. In the following example,
a predefined `CanUnregisterDomain` permission token is used. 

You can also define your own permission tokens, 
see [Define Custom Permission Tokens](define-custom-permission-tokens.md).

```rust
fn register_new_role_with_permission(
    role_name: &str,
    domain_id: DomainId,
    iroha_client: &Client
) {
    let role_id = RoleId::from_str(role_name).unwrap();
    let can_unregister_domain = PermissionToken::new(
        "CanUnregisterDomain".parse().unwrap(),
        &json!({ "domain_id": domain_id }),
    );
    let role = iroha_data_model::role::Role::new(role_id)
        .add_permission(can_unregister_domain);
    let register_role = Register::role(role);
    iroha_client.submit(register_role).unwrap();
}
```
