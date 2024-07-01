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
fn check_status(iroha: &Client) {
    let status = iroha.get_status().unwrap();
    println!("{:#?}", status);
}
```

Sample output:

```
Status {
    peers: 4,
    blocks: 5,
    txs_accepted: 31,
    txs_rejected: 3,
    uptime: Uptime(5.937s),
    view_changes: 2,
    queue_size: 18,
}
```