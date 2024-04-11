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
    iroha: &Client
) {
    let role_id = RoleId::from_str("MY_EMPTY_ROLE").unwrap();
    let role = iroha_data_model::role::Role::new(role_id);
    let register_role = Register::role(role);
    iroha.submit(register_role).unwrap();
}
```

Permission tokens may be added to a role. In the following example,
a predefined `CanUnregisterDomain` permission token is used. 

You can also define your own permission tokens, 
see [Define Custom Permission Tokens](define-custom-permission-tokens.md).

```rust
fn register_new_role_with_permission(
    iroha: &Client,
) {
    let roses_of_alice = AssetId::from_str("rose##alice@wonderland").unwrap();
    let roses_of_mouse = AssetId::from_str("rose##mouse@wonderland").unwrap();
    let can_burn_roses_of_alice = PermissionToken::new(
        "CanBurnUserAsset".parse().unwrap(),
        &json!({ "asset_id": roses_of_alice }),
    );
    let can_burn_roses_of_mouse = PermissionToken::new(
        "CanBurnUserAsset".parse().unwrap(),
        &json!({ "asset_id": roses_of_mouse }),
    );
    let rose_burner = Role::new("ROSE_BURNER".parse().unwrap())
        .add_permission(can_burn_roses_of_alice)
        .add_permission(can_burn_roses_of_mouse);
    let register_rose_burner = Register::role(rose_burner);
    iroha.submit(register_rose_burner).unwrap();
}
```
