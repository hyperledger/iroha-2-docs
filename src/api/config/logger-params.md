# Logger Parameters

Explain module

## `logger.level`

- **ENV:** `LOG`, `LOG_LEVEL`, `IROHA_LOG_LEVEL`
- **Type:** String
- **Possible Values:** `"TRACE"`, `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"`,
  or `"FATAL"`
- **Default:** `"INFO"`

Maximum log level

## `logger.compact_mode`

- **Type:** Boolean
- **Default:** `false`

Compact mode (no spans from telemetry)

::: warning

Conflicts with [`logger.terminal_colors`](#logger-terminal-colors)

:::

## `logger.log_file_path`

- **Type:** String
- **Optional**

TODO: Find a standard name for log file path? (i.e. posix)

If provided, logs will be copied to said file in the format readable by
[bunyan](https://lib.rs/crates/bunyan)

## `logger.terminal_colors`

- **Type:** Boolean
- **Default:** depends on `logger.compact_mode`. If compact mode is
  disabled (which is by default), then `true`. If enabled, then `false`.

Enable ANSI terminal colors for formatted output.

::: warning

This will produce a warning:

```toml
[logger]
compact_mode = true
colorize_output = true # INVALID: should be `false` or omitted
```

:::
