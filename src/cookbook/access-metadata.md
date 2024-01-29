---
title: "Access Metadata | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to access metadata of Iroha objects such as domains, accounts, assets, and so on."
  - - meta
    - name: keywords
      content: "Iroha metadata"
---

# How to Access an Object's Metadata

```rust
    /*

    Description:
    In the Iroha 2 almost all basic objects like Account, Asset, Domain etc. have a Metadata field,
    which is a struct that consists of one field with BTreeMap type.
    By default the basic objects are created with 0 metadata capacity so if you get empty result,
    be sure that metadata has been added into the object.

    The current example describes how to get metadata from an Account.

    Precondition: The object has been created with a metadata.

     */

    //Define the target account and make a request to get this account's object
    let account_id: AccountId = "artem@wonderland".parse().unwrap();
    let account: Account = iroha_client.request(FindAccountById::new(account_id)).unwrap();

    //Bind metadata struct to a variable
    let account_metadata: &Metadata = account.metadata();

    //Iterate for the metadata in the account's object
    for metadata in account_metadata.iter() {
        println!("{:?}", metadata)
    }

```