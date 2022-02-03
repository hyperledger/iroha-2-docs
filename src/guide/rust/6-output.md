# 6. Visualizing outputs (Rust)

Finally, we should talk about visualising data. The `rust` API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built.

We shall, however, leave most of the aforementioned advanced features down the rabbit hole, up to the reader's own devices to discover. This document can easily get out of sync with the state of the API features. By contrast, the online documentation is always up to date. Plus a short tutorial wouldn't be able to do all these features justice. Instead, we shall retain parity with other language tutorials and introduce you to pipeline filters.

There are two possible event filters: `PipelineEventFilter` and `DataEventFilter`, we shall focus on the former. This filter sieves events pertaining to the process of submitting a transaction, executing a transaction and committing it to a block.

First, let's build a filter

```rust
use iroha_data_model::prelude::*;

let filter = EventFilter::Pipeline(PipelineEventFilter::identity());
```

Then, we start listening for events in an infinite loop:

```rust
for event in iroha_client.listen_for_events(filter)? {
  match event {
    Ok(event) => println!("Success: {:#?}", event),
    Err(err) => println!("Sadness:( {:#?}",  err),
  }
};
```

**Needless to say that a synchronous infinite blocking loop is bad UX for anything but a command-line program**, but for illustration purposes, this would create a nice printout, just like in `iroha_client_cli`.
