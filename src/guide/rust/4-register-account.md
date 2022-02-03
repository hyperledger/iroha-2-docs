# 4. Registering an Account (Rust)

Registering an account is a bit more involved than registering a domain. With a domain, the only concern is the domain name, however, with an account, there are a few more things to worry about.

First of all, we need to create an `AccountId`. Note, that we can only register an account to an existing domain. The best UX design practices dictate that you should check if the requested domain exists _now_, and if it doesn’t — suggest a fix to the user. After that, we can create a new account, that we name _late_bunny._

```rust
let id = iroha_data_model::account::Id {
    name: "late_bunny",
    domain_name: "looking_glass"
};
```

Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn't the brightest idea. Remember*,* that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? **Instead, the best way is to **ask\*\* _late_bunny_ to generate a new key-pair, and give you the public half of it.

```rust
let key: PublicKey = get_key_from_late_bunny();
```

Only then do we build an instruction from it:

```rust
let create_account =
    RegisterBox::new(IdentifiableBox::from(NewAccount::with_signatory(id, key)));
```

Which is then **wrapped in a transaction** and **submitted to the peer** as [in the previous section](./3-register-domain).
