---
title: "Check Status | Cookbook"
head:
  - - meta
    - name: description
      content: "Learn how to check the Iroha status."
  - - meta
    - name: keywords
      content: "telemetry, Iroha status"
---

# How to Check Iroha Status

```rust
    // To get the status, the Client struct already has a function get_status(),
    // so you may just execute it.
    // The result message will include a deserialized json object with parameters like:
    //  Quantity of peers
    //  Quantity of blocks
    //  Quantity of accepted and rejected transactions and some more
    let status = iroha_client.get_status().unwrap();
    println!("{:?}", status);
```