# Logger Parameters

This page explains the parameters related to logging operations of Iroha 2, as managed by the Logger module.

## `logger.format`

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

## `logger.tokio_console_address`