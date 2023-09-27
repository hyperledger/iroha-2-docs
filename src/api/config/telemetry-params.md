# Telemetry Parameters

Two Telemetries are supported: Substrate-based and File-based.

## `telemetry.substrate`

Enables Substrate active outbound telemetry.

**Fields:**

- **`name`:** The node's name to be seen on the telemetry
  - **Type:** String
  - **Required**
- **`url`:** The url of the telemetry
  - **Type:** String, URL
  - **Required**
- **`min_retry_period`:** The minimum period of time in seconds to wait
  before reconnecting
  - **Type:** String or Number, [Duration](glossary#type-duration)
  - **Default:** 1 second
- **`max_retry_delay_exponent`:** The maximum exponent of 2 that is used
  for increasing delay between reconnections
  - **Type:** Number, u8
  - **Default:** 4

**Example:**

```toml
[telemetry.substrate]
name = "iroha"
url = "ws://127.0.0.1:8001/submit"
```

## `telemetry.file_output`

Enables file-based active outbound telemetry.

**Fields:**

- **`file`:** The filepath that to write dev-telemetry to
  - **Type:** String, file path
  - **Required**

```toml
[telemetry.file_output]
file = "/path/to/file"
```
