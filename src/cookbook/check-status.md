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
    let status = iroha_client.get_status().unwrap();
    println!("{:?}", status);
```