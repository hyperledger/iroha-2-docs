# Kura Parameters

TODO: Explain Kura module

## `kura.store_dir` {#param-store-dir}

- **Type:** String
- **Default:** `./storage`
- **ENV:** `KURA_STORE_DIR`

Path to the existing block store folder or path to create new folder.

**Example:**

```toml
[kura]
store_dir = "./storage"
```

TODO: will the path be resolved relative to the config file location, or to
CWD? the former is more intuitive

## `kura.debug.output_new_blocks` {#param-debug-output-new-blocks}

## `kura.init_mode` {#param-init-mode}

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
