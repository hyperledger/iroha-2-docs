# Snapshot Parameters

This module is responsible for reading and writing snapshots of the
[World State View](/guide/blockchain/world#world-state-view-wsv).

TODO: explain the purpose of snapshots, file formats, etc

::: tip Wipe Snapshots

In case if something is wrong with the snapshots system, and you want to start from a blank page (in terms of
snapshots), you could remove the directory specified by [`snapshot.store_dir`](#param-store-dir).

:::

## `snapshot.create_every` {#param-create-every}

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 minute

Frequency of making snapshots

**Example:**

```toml
[snapshot]
create_every = "1 minute"
```

## `snapshot.mode` {#param-mode}

Specifies the mode the Snapshot system functions in.

- **Type:** String
- **Possible Values:**
  - **`read_write`:** Iroha creates snapshots with a period specified by `snapshot.create_every`. On startup, Iroha reads an
    existing snapshot (if any) and verifies that it is up-to-date with the blocks storage.
  - **`readonly`:** Similar to `normal` but Iroha doesn't create any snapshots.
  - **`disabled`:** Iroha neither creates new snapshots nor reads an existing one on startup.
- **Default:** `normal`

**Example:**

```toml
[snapshot]
mode = "read_write"
```

## `snapshot.store_dir` {#param-store-dir}

- **Type:** String
- **Default:** `./storage/snapshot`

Directory where to store snapshots

**Example:**

```toml
[snapshot]
store_dir = "./storage/snapshot"
```
