# Glossary

This page contains explanations of some types and topics shared across multiple configuration parameters.

## Actor Channel Capacity

TODO Explain what does it mean

## Numeric Types

Explain the limitations of different numeric types, like `u8` and `u64`.

## Type - Duration

Might be specified as `"2m"`, `1000` (means ms), `"3h"` etc. TODO.

See
[`humantime` crate](https://docs.rs/humantime/latest/humantime/fn.parse-duration.html)

## Type - Multi-hash

Describe what the hell is this

## Type - Byte Size

Might be a number of bytes, or a readable string

[`humansize` - Rust](https://docs.rs/humansize/latest/humansize/)

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
