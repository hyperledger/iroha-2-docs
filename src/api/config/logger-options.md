# Logger Options

Explain module

## `logger.level`

- **ENV:** `LOG`, `LOG_LEVEL`, `IROHA_LOG_LEVEL`
- **Type:** String
- **Possible Values:** `"TRACE"`, `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"`,
  or `"FATAL"`
- **Default:** `"INFO"`

Maximum log level

## `logger.compact-mode`

- **Type:** Boolean
- **Default:** `false`

Compact mode (no spans from telemetry)

::: warning

Conflicts with [`logger.terminal-colors`](#logger-terminal-colors)

:::

## `logger.log-file-path`

- **Type:** String
- **Optional**

TODO: Find a standard name for log file path? (i.e. posix)

If provided, logs will be copied to said file in the format readable by
[bunyan](https://lib.rs/crates/bunyan)

## `logger.terminal-colors`

- **Type:** Boolean
- **Default:** depends on `logger.compact-mode`. If compact mode is
  disabled (which is by default), then `true`. If enabled, then `false`.

Enable ANSI terminal colors for formatted output.

::: warning

This will produce a warning:

```toml
[logger]
compact-mode = true
colorize-output = true # INVALID: should be `false` or omitted
```

:::
