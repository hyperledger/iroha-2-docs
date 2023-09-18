# Glossary

This page contains explanations of some types and topics shared across multiple configuration parameters.

## Actor Channel Capacity

TODO Explain what does it mean

## Numeric Types

Explain the limitations of different numeric types, like `u8` and `u64`.

## Type - Duration

Duration might be specified in two ways: 

- As a Number, which will be considered an amount in milliseconds
- As a String, which will be parsed as a human-readable duration string

Numeric setting is straightforward:

```toml
value = 1000 # 1000 milliseconds
```

String setting might be more readable:

```toml
value1 = "1sec"
value2 = "1hour 12min 5s"
value3 = "2years 2min 12us"
```

The duration string is a concatenation of time spans. Each time span is an integer number and a suffix. Supported suffixes:

- `nsec`, `ns` &mdash; nanoseconds
- `usec`, `us` &mdash; microseconds
- `msec`, `ms` &mdash; milliseconds
- `seconds`, `second`, `sec`, `s`
- `minutes`, `minute`, `min`, `m`
- `hours`, `hour`, `hr`, `h`
- `days`, `day`, `d`
- `weeks`, `week`, `w`
- `months`, `month`, `M` &mdash; defined as $30.44$ days
- `years`, `year`, `y` &mdash; defined as $365.25$ days

TODO: put link to [`humantime` crate](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)? It is an implementation detail.

## Type - Multi-hash

Describe what the hell is this

## Type - Byte Size

Byte size values might be set in two ways:

- As a Number, which will be considered an amount in bytes
- As a String, which will be parsed as a human-readable byte size string

Number:

```toml
value = 512 # 512 bytes
```

String:

```toml
# 42 bytes
value1 = "42"
value2 = "42b"
value3 = "42bytes"

# 1 kilobyte = 1000 bytes
value4 = "1KB"

# 1 kilobyte (binary format) = 1024 bytes
value5 = "1KiB"

# Combination of multiple
value412 = "1GB 5MB"
```

Iroha can parse sizes in bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes.

The format of suffixes:

- **`{size}iB`:** Binary size
- **`{size}B`:** Decimal size


TODO: haven't found a rust lib for that. There is a Python one ([`humanfriendly`](https://humanfriendly.readthedocs.io/en/latest/api.html?highlight=parse_size#humanfriendly.parse_size)) I used for reference.

TODO: [article explains kb, kB, KiB difference](https://web.archive.org/web/20150324153922/https://pacoup.com/2009/05/26/kb-kb-kib-whats-up-with-that/). Consider it for the format. 


## Type - Private Key

```toml
private-key = { digest = "ed25519", payload = "" }
```

## Type - Socket Address

```
<host>:<port>
```

```
localhost:8080
127.0.0.1:1337
sample.com:9090
```

In TOML it should be specified as a string:

```toml
address = "localhost:8000"
```

## Type - Metadata Limits

Bla bla

### Default Metadata Limits

Display the value here
