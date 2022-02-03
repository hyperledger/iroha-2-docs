# 1. Iroha 2 Client Setup (JavaScript)

The Iroha 2 JavaScript library consists of multiple packages:

- `@iroha2/client` — which submits requests to Iroha Peer
- `@iroha2/data-model` — provides [SCALE](https://github.com/paritytech/parity-scale-codec) (Simple Concatenated Aggregate Little-Endian)-codecs for the Iroha 2 Data Model.
- `@iroha2/crypto-core` — cryptographic primitives
- `@iroha2/crypto-target-node` — compiled crypto WASM ([Web Assembly](https://webassembly.org/)) for the Node.js environment
- `@iroha2/crypto-target-web` — compiled crypto WASM for native Web (ESM)
- `@iroha2/crypto-target-bundler` — compiled crypto WASM to use with bundlers such as Webpack

To install these packages, firstly you need to setup a registry:

```ini
# .npmrc
@iroha2:registry=https://nexus.iroha.tech/repository/npm-group/
```

Then you can install these packages as any other NPM package:

```bash
npm i @iroha2/client
yarn add @iroha2/data-model
pnpm add @iroha2/crypto-target-web
```

The set of packages that you need to install depends on your intention. Maybe you only need to play with the Data Model to perform (de-)serialisation, in which case the `data-model` package is enough. Maybe you only need to check on a peer in terms of status/health, thus need only the client library, because this API doesn't require any interactions with crypto or Data Model. For the purposes of this tutorial, it’s better to install everything, however, in general the packages are maximally decoupled, so you can minimise the footprint.

Moving on, if you are planning to use the Transaction or Query API, you’ll also need to inject an appropriate `crypto` instance into the client at runtime. This has to be adjusted depending on your particular environment. For example, for Node.js users, such an injection may look like the following:

```ts
import { crypto } from `@iroha2/crypto-target-node`
import { setCrypto } from `@iroha2/client`

setCrypto(crypto)
```

::: info

Please refer to the related `@iroha2/crypto-target-*` package documentation because it may require some specific configuration. For example, the `web` target requires to call an asynchronous `init()` function before usage of `crypto`.

:::
