# Snapshot Parameters

## `snapshot.enabled`

- **Type:** Boolean
- **Default:** `true`

Enable snapshot

```toml
[snapshot]
enabled = true
```

## `snapshot.create_every`

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 minute

Frequency of making snapshots

```toml
[snapshot]
create_every = "1 minute"
```

## `snapshot.dir_path`

- **Type:** String
- **Default:** `"./storage"` (note: same as
  [`kura.block_store_path`](kura-params#kura-block-store-path))

TODO: fix inconsistency: `kura.block_store_path` and `snapshot.dir_path`.
Maybe, `kura.block_store_directory` and `snapshot.directory`?

Directory where to store snapshots

```toml
[snapshot]
dir_path = "./storage"
```
