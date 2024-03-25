# Telemetry Parameters

Two Telemetries are supported: Substrate-based and File-based.

**Example:**

```toml
[telemetry.substrate]
name = "iroha"
url = "ws://127.0.0.1:8001/submit"
```


## `telemetry.name` {#param-name}

- **Type:** String
- Must be paired with `telemetry.url`

The node's name to be displayed on the telemetry

## `telemetry.min_retry_period` {#param-min-retry-period}

- **Type:** String or Number, [Duration](glossary#type-duration)
- **Default:** 1 second


The minimum period of time in seconds to wait before reconnecting

## `telemetry.max_retry_delay_exponent` {#param-max-retry-delay-exponent}

- **Type:** Number, u8
- **Default:** 4


The maximum exponent of 2 that is used for increasing delay between reconnections

## `telemetry.dev.out_file` {#param-dev-out-file}

Enables file-based active outbound telemetry.

**Fields:**

- **`file`:** The filepath to write dev-telemetry to
  - **Type:** String, file path
  - **Required**

```toml
[telemetry.file_output]
file = "/path/to/file"
```

## `telemetry.url` {#param-url}

- **Type:** String, URL
- Must be paired with `telemetry.name`

The url of the telemetry
