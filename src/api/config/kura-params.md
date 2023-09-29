# Kura Parameters

TODO: Explain Kura module

## `kura.init_mode`

- **Type:** String
- **Possible Values:**
  - `strict`: strict validation of all blocks
  - `fast`: fast initialization with basic checks
- **Default:** `strict`

## `kura.block_store_path`

- **Type:** String
- **Default:** `./storage`

Path to the existing block store folder or path to create new folder.

TODO: will the path be resolved relative to the config file location, or to CWD? the former is more intuitive

TODO: Validation of this parameter is kind of delayed. What if error appears very  late after configuration is resolved? It would be useful to throw an error with a snippet pointing to the configuration

## `kura.blocks_per_storage_file`

- **Type:** non-zero u64
- **Default:** $1\ 000$

Maximum number of blocks to write into a single storage file.
