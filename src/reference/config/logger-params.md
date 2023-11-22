# Logger Parameters

This page explains the parameters related to logging operations of Iroha 2, as managed by the Logger module.

## `logger.compact`

- **Type:** Boolean
- **Default:** `false`

Use compact logging format.

**Example:**

```toml
[logger]
compact = true
```

TODO: give an example of compact and full logs. More clue in
[tracing Compact docs](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/struct.Compact.html#example-output)

## `logger.file`

- **Type:** String
- **Optional**

If provided, logs will be copied to said file in the format readable by [bunyan](https://lib.rs/crates/bunyan).

**Example:**

```toml
[logger]
file = "/usr/logs/iroha.jsonlogs"
```

::: tip Relative Paths

You can use relative paths. They will be resolved relative to the configuration file location:

```toml
# /home/iroha.toml
[logger]
file = "logs.jsonlogs" # will be `/home/logs.jsonlogs`
```

:::

::: tip Standard Streams

[Standard streams](https://en.wikipedia.org/wiki/Standard_streams) might be used as a destination as well:

```toml
[logger]
file = "/dev/stdout"
```

:::

TODO: relative to CWD or to the config file?

TODO: which file extension should we use in examples? `.jsonlogs`?

## `logger.level`

Sets the logging sensitivity.

- **ENV:** `LOG`, `LOG_LEVEL`, `IROHA_LOG_LEVEL`
- **Type:** String
- **Possible Values:**
  - **`TRACE`:** All events, including low-level operations.
  - **`DEBUG`:** Debug-level messages, useful for diagnostics.
  - **`INFO`:** General informational messages.
  - **`WARN`:** Warnings that indicate potential issues.
  - **`ERROR`:** Errors that disrupt normal function but allow continued operation.
  - **`FATAL`:** Critical errors that lead to immediate termination.
- **Default:** `INFO`

Choose the level that best suits your use case. Refer to
[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) for additional
details on how to use different log levels.

**Example:**

::: code-group

```toml [Configuration file]
[logger]
level = "INFO"
```

```shell [ENV]
LOG_LEVEL=INFO
```

:::

## `logger.terminal_colors`

- **Type:** Boolean
- **Default:** `true`

Enable ANSI terminal colors for formatted output.

**Example:**

```toml
[logger]
terminal_colors = true
```
