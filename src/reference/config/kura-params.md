# Kura Parameters

TODO: Explain Kura module

## `kura.block_store_path`

- **Type:** String
- **Default:** `./storage`

Path to the existing block store folder or path to create new folder.

**Example:**

```toml
[kura]
block_store_path = "./storage"
```

TODO: will the path be resolved relative to the config file location, or to CWD? the former is more intuitive

## `kura.debug.output_new_blocks`

## `kura.init_mode`

- **Type:** String
- **Possible Values:**
  - **`strict`:** strict validation of all blocks
  - **`fast`:** fast initialization with basic checks
- **Default:** `strict`

**Example:**

```toml
[kura]
init_mode = "strict"
```

TODO: can we change this parameter and restart peer?
