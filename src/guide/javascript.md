# TypeScript/JavaScript Guide

::: tip Prerequisites

- Familiarity with the command line
- Familiarity with [Node.js](https://nodejs.org/). Install version 16.0 or
  higher.

:::

In this section we will introduce how Iroha 2 JavaScript SDK is organised
and how to use it to communicate with Iroha from Node.js and Browser.

All code snippets are written in TypeScript, however it is completely fine
to use pure JavaScript with the SDK &mdash; you should just omit
TypeScript-specific syntax and everything should work just fine.

Please notice that the SDK, as well as its documentation, are work in
progress. Everything could change. Not everything is implemented perfectly.
Don't hesitate to keep in touch with us if you have any ideas how to
improve things.

[//]: # 'todo'

This guide is organised a set of snippets with no specific instruction how
to run them. The intention is to give you an understanding of how things
are done and how to use it. We don't say you "write this code into this
file, then run this file using this command and see that result".

::: tip Version notice

[//]: # 'TODO update versions after packages publishing'

This tutorial is based on `@iroha2/client` and `@iroha2/data-model` version
`x.x.x` (todo put link with hash to `hyperledger/iroha-javascript`). This
version is built for Iroha of version `2.0.0-pre-rc.XX` (todo put the same
hash link but to iroha repo).

:::

## SDK Overview

Iroha 2 JavaScript SDK is a set of Node.js packages. They are distributed
through Iroha Nexus Registry[^1]. It is just like the main NPM Registry,
but requires a bit of configuration for NPM to fetch SDK packages from the
right place. We will explain details
[a little further](#installing-iroha-2-javascript-sdk-packages).

[^1]:
    In the future, the packages will be published in the main NPM Registry,
    but as for now we decided to keep it in a controllable "sandbox"
    registry due to the WIP state of the SDK.

The SDK consists of multiple packages:

| Package                                                           | Description                                                                                                                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@iroha2/data-model`                                              | Provides [SCALE](https://github.com/paritytech/parity-scale-codec) (Simple Concatenated Aggregate Little-Endian)-codecs for the Iroha 2 Data Model |
| `@iroha2/client`                                                  | Submits requests to Iroha Peer                                                                                                                     |
| `@iroha2/crypto-core`                                             | Contains cryptography types and target-agnostic utils.                                                                                             |
| `@iroha2/crypto-target-node`                                      | Provides compiled crypto WebAssembly[^2] (WASM) for the Node.js environment                                                                        |
| `@iroha2/crypto-target-web`                                       | Provides compiled crypto WASM for native Web (ESM)                                                                                                 |
| <code class="whitespace-pre">@iroha2/crypto-target-bundler</code> | Provides compiled crypto WASM to use with bundlers such as Webpack                                                                                 |

[SCALE](https://github.com/paritytech/parity-scale-codec) is a binary
format used to efficiently serialize and deserialize data. The
`@iroha2/data-model` package in the Iroha 2 JavaScript SDK provides the
SCALE codecs for the Iroha 2 Data Model. The Data Model is a collection of
types that are used to represent various aspects of the Iroha 2 blockchain,
such as transactions, blocks, assets, and more. By using SCALE to encode
these types, the data can be transmitted more efficiently across the
network, reducing bandwidth usage and improving performance.

As for the `@iroha2/crypto-core` package, it provides various
cryptography-related types and utility functions. This includes
cryptographic primitives such as hashes, signatures, and keypairs, as well
as utilities for encoding and decoding keys in various formats. The
`@iroha2/crypto-target-node` and `@iroha2/crypto-target-web` packages
provide compiled WebAssembly implementations of these primitives for use in
Node.js and web environments, respectively. Finally, the
`@iroha2/crypto-target-bundler` package provides a version of the
WebAssembly code that is optimized for use with bundlers like Webpack.

[^2]: [Web Assembly](https://webassembly.org/)

::: tip Online API documentation

We are planning to deploy online API documentation for all SDK packages.
You can track its progress in
[the related issue](https://github.com/hyperledger/iroha-javascript/issues/154).

:::

We will explore each component in a bit more depth.

### Installing Iroha 2 JavaScript SDK packages

To use the Iroha 2 JavaScript SDK, you'll need to install the required
packages. The SDK consists of multiple packages, which are distributed
through Iroha Nexus Registry. This registry is similar to the main NPM
Registry, but requires some configuration to ensure that NPM fetches SDK
packages from the correct place.

1. **Setting up Iroha Nexus Registry.** To set up Iroha Nexus Registry for
   the `iroha2` scope, you need to configure your NPM project's `.npmrc`
   file. This file is typically located in your NPM project directory. Add
   the following line to the `.npmrc` file:

   ```ini
   @iroha2:registry=https://nexus.iroha.tech/repository/npm-group/
   ```

2. **Installing packages.** After configuring your NPM project to use Iroha
   Nexus Registry, you can install the necessary packages using the npm
   install command. Here's an example command that installs the
   `@iroha2/client` and `@iroha2/data-model` packages:

   ```bash
   $ npm install @iroha2/client @iroha2/data-model
   ```

   You can also install individual packages if you only need to use
   specific components of the SDK.

Note that the SDK is still a work in progress and everything may change. If
you have any ideas for improving the SDK or its documentation, don't
hesitate to get in touch with the developers.

### Data Model

To interact with Iroha, we need to speak its language, which is built using
various structures collectively referred to as **the data model**. In
JavaScript, we construct these structures using JS-land notation and then
encode them into the SCALE binary representation for transmission to Iroha.
When Iroha sends data back, we decode it from the SCALE representation to
JavaScript-land notation for further processing.

The `@iroha2/data-model` package provides each data model structure as
follows:

```ts
import { datamodel } from '@iroha2/data-model'
```

::: tip Data-model schema

**Note:** Currently, the data model is defined through a schema generated
by Kagami, but it has a raw format, and each SDK uses its approach for code
generation. In particular, the JavaScript SDK flattens all schema names
into a single namespace where things like `pipeline::Event` and
`trigger::Event` are flattened to `PipelineEvent` and `TriggerEvent` so
that they don't conflict with each other.

See also:

- [Issue related to the schema unification](https://github.com/hyperledger/iroha/pull/3317)

:::

Each `datamodel.*` item is both a codec and a value factory:

```js
// using factory to define `NumericValue`
const value = datamodel.NumericValue('U32', 42)

// using codec's `toBuffer` to encode it to binary
const encoded = datamodel.NumericValue.toBuffer(value)

// decode it back
const decoded = datamodel.NumericValue.fromBuffer(value)
```

The data model package is built using the SCALE codec library. Refer to the
links below to explore these concepts in-depth.

::: tip TypeScript

Each data model item is a codec from the runtime side but an opaque value
type from the type side. In other words, each codec is an opaque type for
better type safety.

```ts
declare function test(value: datamodel.NumericValue)

test(datamodel.NumericValue('U128'))
```

All values under the hood are plain JavaScript objects and primitives. You
can avoid defining values with factories by constructing values directly
and using `as`:

```ts
import { datamodel, variant } from '@iroha2/data-model'

const domain = { name: 'wonderland' } as datamodel.DomainId
const num = { enum: variant('Fixed', '0.2') } as datamodel.NumericValue
```

:::

This guide heavily relies on the "sugar" feature, an experimental and
incomplete opt-in API that helps build common data model structures
conveniently:

js

```js
import { datamodel, sugar } from '@iroha2/data-model'

// Equivalent definitions.
const accountId1 = sugar.accountId('alice', 'wonderland')
const accountId2 = datamodel.AccountId({
  name: 'alice',
  domain_id: datamodel.DomainId({ name: 'wonderland' }),
})

const value1 = sugar.value.numericU32(51)
const value2 = datamodel.Value(
  'Numeric',
  datamodel.NumericValue('U32', 51),
)
```

[//]: # 'TODO: Add an example of instruction and executable.'

::: warning

The Sugar API is experimental and incomplete. However, even in its current
state, we believe it's useful for educational purposes and makes it easier
to read this tutorial. The Sugar API is likely to change in the future.

:::

Links:

- Data model package in the repository
- SCALE codec compiler
- SCALE codec runtime
- SCALE codec enum

### Crypto

Crypto is an essential part of blockchain development, and the Iroha 2 SDK
provides a robust set of cryptographic tools to work with keys, signatures,
and hashes.

The SDK's crypto module is built on Web Assembly (WASM) compiled from Rust.
There are three different WASM builds available for different targets:
`web`, `node`, and `bundler`. Each build provides the same set of
cryptographic functions and can be used in the corresponding target
environment.

#### Using Crypto

To use @iroha2/crypto, you must first install the target-specific
package(s) that you require. Refer to
[the Packages Installation section](#installing-iroha-2-javascript-sdk-packages)
for instructions on how to do this.

Once the target-specific package(s) are installed, you can import the
necessary functions and classes from them. Refer to the READMEs for the
target-specific packages for detailed API explanations (links below).

Note that the core package, which contains types and re-exported utils, is
named `@iroha2/crypto-core`, while the target-specific packages are named
`@iroha2/crypto-target-<target>`.

#### Memory Management

It is important to manage memory carefully when working with WebAssembly.
`@iroha2/crypto-*` provides utilities to help manage memory, such as the
`freeScope` function from the `@iroha2/crypto-core` (re-exported from
`@iroha2/crypto-util`) package.

Objects that reflect some struct in WASM have a `.free()` method to trigger
deallocation manually. However, all such objects are wrapped and tracked,
so this process can be automated using the `freeScope` function.

The following code example shows how to use the `freeScope` function to
achieve automatic memory deallocation:

```ts
import { freeScope } from '@iroha2/crypto-core'
import { crypto } from '@iroha2/crypto-target-node'

const keypair = freeScope((scope) => {
  const seed = crypto.Hash.hash('hex', '00aa11').bytes()
  const keypair = crypto.KeyGenConfiguration.default()
    .useSeed('array', seed)
    .generate()
  scope.forget(keypair)
  return keypair
})
```

Refer to the `@iroha2/crypto-util` package documentation for more details
on memory management.

#### Links to Crypto

- [`@iroha2/crypto-core` (GitHub)](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/core)
- [`@iroha2/crypto-target-web` (GitHub)](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-web)
- [`@iroha2/crypto-target-node` (GitHub)](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-node)
- [`@iroha2/crypto-target-bundler` (GitHub)](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-bundler)
- [`@iroha2/crypto-util` (GitHub)](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/util)

### Client

The Iroha 2 JavaScript SDK Client is the entry point for interacting with
the Iroha blockchain. The `@iroha2/client` library provides a set of tools
that allows users to send transactions, queries, and listen for events and
blocks.

The client library consists of several components:

- Payload Helpers: a set of functions that help to build a transaction or
  query payload, sign it, compute its hash, and more. For example:

  ```ts
  // example of how to use payload helpers
  ```

- `Torii`: the core object with static methods to work with an Iroha peer.
  It provides several methods including:

  - `.submit` (Transactions API)
  - `.request` (Query API)
  - `.getStatus` (Telemetry)
  - `.listenForEvents` (Events API)
  - `.listenForBlocksStream` (Block Stream API)
  - ...and others

  Each method has its own **prerequisites** - an object with required URLs
  and `fetch`/`ws` instance. There are 2 URLs - for main API endpoints and
  for Telemetry ones. `Torii` uses an isomorphic transport approach, so the
  actual WebSocket and HTTP clients should be provided manually according
  to the environment (e.g. Node.js or Browser).

  ```ts
  // example of how to invoke Torii methods
  ```

- `Signer`: a simple class that produces a digital signature for a given
  binary payload. It is constructed with an `datamodel.AccountId` and
  `cryptoTypes.KeyPair`. The `.sign()` method accepts any binary payload
  and produces a `datamodel.Signature`. Although only the key pair is
  needed to produce the signature, `accountId` is required by `Client`.

  ```ts
  // example of how to call the `sign()` method
  ```

- `Client`: an opinionated high-level class that combines `Torii`,
  `Signer`, and helper functions to provide two convenient methods to work
  with the Transaction API and Query API. For example, instead of building
  and signing a transaction from a `datamodel.Executable`, you can pass it
  to the `client.submitExecutable()` method, and it will handle the rest.

Before using crypto-related functions from `@iroha2/client`, you must
inject a crypto instance first. The client library is made to be
environment-agnostic, so you should install the appropriate
`@iroha2/crypto-target-*` package and pass its crypto instance to the
`setCrypto()` method. For example, in a Node.js environment:

```ts
import { crypto } from '@iroha2/crypto-target-node'
import { setCrypto, computeTransactionHash } from '@iroha2/client'

setCrypto(crypto)

// now you can use it
computeTransactionHash()
```

Here is an example of how all the described features look in code:

```
TODO
```

Refer to the
[`@iroha2/client`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/client)
package documentation for detailed API explanations.

## 0. Prepare project

## 1. Client Installation

All of these are published under the `@iroha2` scope into Iroha Nexus
Registry. In the future, they will be published in the main NPM Registry.

::: info

You can also work with the sources in Iroha Javascript repository, where
the active development is happening. Clone the repository and check out the
`iroha2` branch:

```bash
$ git clone https://github.com/hyperledger/iroha-javascript.git --branch iroha2
```

Please note that this guide does not cover the details of this workflow.

[//]: # 'FIXME Why do we need this here?'

:::

While we've taken great care to decouple the packages, so you could
minimise their footprint, for the purposes of this tutorial, it's better to
install everything.

The installation consists of two steps: setting up a registry and then
installing the packages you need.

1. Set up a registry. In shell, run:

   ```bash
   $ echo "@iroha2:registry=https://nexus.iroha.tech/repository/npm-group/" > .npmrc
   ```

2. Install Iroha 2 packages as any other NPM package. If you are following
   the tutorial, we recommend installing all of the following:

   ```bash
   $ npm i @iroha2/client
   $ npm i @iroha2/data-model
   $ npm i @iroha2/crypto-core
   $ npm i @iroha2/crypto-target-node
   $ npm i @iroha2/crypto-target-web
   $ npm i @iroha2/crypto-target-bundler
   ```

   ::: info

   Note that you can use other package managers, such as
   [yarn](https://yarnpkg.com) or [pnpm](https://pnpm.io), for a faster
   installation. For example:

   ```bash
   $ yarn add @iroha2/data-model
   $ pnpm add @iroha2/crypto-target-web
   ```

   :::

   The set of packages that you need to install depends on what you are
   trying to achieve. If you only need to play with the Data Model to
   perform (de-)serialisation, the `data-model` package is sufficient. If
   you need to check on a peer in terms of its status or health, then you
   only need the client library.

3. Install the following packages as well:

   ```bash
   $ npm i hada
   $ npm i tsx -g
   ```

4. If you are planning to use the Transaction or Query API, you'll also
   need to inject an appropriate `crypto` instance into the client at
   runtime. This has to be adjusted according to your particular
   environment.

   For example, Node.js users need the following:

   <<<@/snippets/js-sdk-1-client-install.ts

   ::: info

   Please refer to the documentation of the respective
   `@iroha2/crypto-target-*` package, because each case has specific
   configuration steps. For example, the `web` target needs to be
   initialised (via asynchronous `init()`) before you can use any
   cryptographic methods.

   :::

::: info NOTE

When you are creating files in the following steps, you must place them in
the same directory that contains `node_modules`, like so:

```
╭───┬───────────────────┬──────╮
│ # │       name        │ type │
├───┼───────────────────┼──────┤
│ 0 │ node_modules      │ dir  │
│ 1 │ addClient.ts      │ file │
│ 2 │ example.ts        │ file │
│ 3 │ package.json      │ file │
│ 4 │ pnpm-lock.yaml    │ file │
│ 5 │ registerDomain.ts │ file │
╰───┴───────────────────┴──────╯
```

We recommend using [`tsx`](https://www.npmjs.com/package/tsx) to run the
scripts you've created. For example:

```bash
$ tsx example.ts
```

:::

## 2. Client Configuration

The JavaScript Client is fairly low-level in a sense that it doesn't expose
any convenience features like a `TransactionBuilder` or a `ConfigBuilder`.

::: info

The work on implementing those is underway, and these features will very
likely be available in the second round of this tutorial's release.

:::

Thus, on the plus side, configuration of the client is simple. On the
downside, you have to prepare a lot manually.

You may need to use transactions or queries, so before we initialize the
client, let's set up this part. Let's assume that you have stringified
public & private keys (more on that later). Thus, a key-pair generation
could look like this:

<<<@/snippets/js-sdk-2-1-1-key-pair.ts

When you have a key pair, you might create a `Signer` using the key pair:

<<<@/snippets/js-sdk-2-1-2-signer.ts

Now we're able to make signatures with `signer.sign(binary)`! However, to
interact with Iroha, we need to be able to do more than just sign. We would
need to send something to Iroha, like transactions or queries. `Torii` will
help us with that.

`Torii` handles HTTP / WebSocket communications with Iroha. We will use it
to communicate with Iroha endpoints. With the help of `Torii` we can:

- Submit transactions with `Torii.submit()`
- Send queries with `Torii.request()`
- Listen for events with `Torii.listenForEvents()`
- Listen for blocks stream with `Torii.listenForBlocksStream()`
- and so on

`Torii` is a stateless object, a compendium of methods. You can look at it
as if it is a class with only static methods. Each method has its own
_requirements_ to be passed in &mdash; some of them only need an HTTP
transport and Iroha Torii Telemetry URL, others &mdash; a WebSocket
transport and Iroha Torii API URL. To better understand how `Torii` is
used, look at this example:

<<<@/snippets/js-sdk-2-2-1-torii-usage-example.ts

In this example, we pass `fetch` (the HTTP transport) and `apiURL` as the
first parameter, and the query itself as the second.

To work with `Torii`, we need to know Iroha Torii URLs. Our Iroha Peer is
configured to listen for API endpoints at `http://127.0.0.1:8080` and for
telemetry endpoints at `http://127.0.0.1:8081`. Then, we need to provide
appropriate HTTP / WebSocket adapters which `Torii` will use[^1]. These
adapters depend on the environment in which you are going to use
`@iroha2/client`.

[^1]:
    We have to pass environment-specific `ws` and `fetch`, because there is
    no way for Iroha Client to communicate with a peer in an
    environment-agnostic way.

In Node.js, the full list of `Torii` requirements (i.e. covering all its
methods) will look like this:

<<<@/snippets/js-sdk-2-2-2-torii-pre-node.ts

::: tip

In the example above, we use
[`node-fetch`](https://www.npmjs.com/package/node-fetch) package which
implements [Fetch API](https://fetch.spec.whatwg.org/#fetch-method) in
Node.js. However, you can use
[`undici`](https://undici.nodejs.org/#/?id=undicifetchinput-init-promise)
as well.

:::

::: info

`fetch: nodeFetch as typeof fetch` type assertion is acceptable here for a
reason. `Torii` expects the "classic", native `fetch` function, which is
available natively in Browser. However, both `node-fetch` and `undici`
don't provide `fetch` that is 100% compatible with the native one. Since
`Torii` doesn't rely on those corner-features that are partially provided
by `node-fetch` and `undici`, it's fine to ignore the TypeScript error
here.

:::

And here is a sample of full `Torii` in-Browser requirements:

<<<@/snippets/js-sdk-2-2-3-torii-pre-web.ts

::: info NOTE

We make `fetch.bind(window)` to avoid
`TypeError: "'fetch' called on an object that does not implement interface Window."`.

:::

Great! Now we have `signer` and `Torii` requirements to work with. Finally,
we can create a `Client`:

<<<@/snippets/js-sdk-2-3-client.ts

`Client` provides useful utilities for transactions and queries. You can
also use `Torii` to communicate with the endpoints directly. `Signer` is
accessible with `client.signer`.

## 3. Registering a Domain

Here we see how similar the JavaScript code is to the Rust counterpart. It
should be emphasised that the JavaScript library is a thin wrapper: It
doesn't provide any special builder structures, meaning you have to work
with bare-bones compiled Data Model structures and define all internal
fields explicitly.

Doubly so, since JavaScript employs many implicit conversions, we highly
recommend that you employ TypeScript. This makes many errors far easier to
debug, but, unfortunately, results in more boilerplates.

Let's register a new domain named `looking_glass` using our current
account, _alice@wondeland_.

First, we need to import necessary models and a pre-configured client
instance:

<<<@/snippets/js-sdk-3-register-domain.ts#pre

To register a new domain, we need to submit a transaction with a single
instruction: to register a new domain. Let's wrap it all in an async
function:

<<<@/snippets/js-sdk-3-register-domain.ts#reg-domain-fn

Which we use to register the domain like so:

<<<@/snippets/js-sdk-3-register-domain.ts#do-reg

We can also use Query API to ensure that the new domain is created. Let's
create another function that wraps that functionality:

<<<@/snippets/js-sdk-3-register-domain.ts#ensure-fn

Now you can ensure that domain is created by calling:

<<<@/snippets/js-sdk-3-register-domain.ts#do-ensure

## 4. Registering an Account

Registering an account is a bit more involved than registering a domain.
With a domain, the only concern is the domain name. However, with an
account, there are a few more things to worry about.

First of all, we need to create an `AccountId`. Note that we can only
register an account to an existing domain. The best UX design practices
dictate that you should check if the requested domain exists _now_, and if
it doesn't, suggest a fix to the user. After that, we can create a new
account named _white_rabbit_.

Imports we need:

<<<@/snippets/js-sdk-4-register-account.ts#imports

The `AccountId` structure:

<<<@/snippets/js-sdk-4-register-account.ts#account

Second, you should provide the account with a public key. It is tempting to
generate both it and the private key at this time, but it isn't the
brightest idea. Remember that _the white_rabbit_ trusts _you,
alice@wonderland,_ to create an account for them in the domain
_looking_glass_, **but doesn't want you to have access to that account
after creation**.

If you gave _white_rabbit_ a key that you generated yourself, how would
they know if you don't have a copy of their private key? Instead, the best
way is to **ask** _white_rabbit_ to generate a new key-pair, and give you
the public half of it.

<<<@/snippets/js-sdk-4-register-account.ts#pubkey

Only then do we build an instruction from it:

<<<@/snippets/js-sdk-4-register-account.ts#isi

Which is then wrapped in a transaction and submitted to the peer the same
way as in the previous section when we registered a domain.

## 5. Registering and minting assets

[//]: # 'TODO'

Iroha has been built with few
[underlying assumptions](./blockchain/assets.md) about what the assets need
to be in terms of their value type and characteristics (fungible or
non-fungible, mintable or non-mintable).

In JS, you can create a new asset with the following construction:

[//]: # '<<<@/snippets/js-sdk-5-1-register-asset.ts'

Pay attention to the fact that we have defined the asset as
`Mintable('Not')`. What this means is that we cannot create more of `time`.
The late bunny will always be late, because even the super-user of the
blockchain cannot mint more of `time` than already exists in the genesis
block.

This means that no matter how hard the _white_rabbit_ tries, the time that
he has is the time that was given to him at genesis. And since we haven't
defined any time in the domain _looking_glass_ at genesis and defined time
in a non-mintable fashion afterwards, the _white_rabbit_ is doomed to
always be late.

If we had set `mintable: Mintable('Infinitely')` on our time asset, we
could mint it:

[//]: # '<<<@/snippets/js-sdk-5-2-mint-asset.ts'

Again it should be emphasised that an Iroha 2 network is strongly typed.
You need to take special care to make sure that only unsigned integers are
passed to the `Value('U32', ...)` factory method. Fixed precision values
also need to be taken into consideration. Any attempt to add to or subtract
from a negative Fixed-precision value will result in an error.

## 6. Transferring assets

After minting the assets, you can transfer them to another account. In the
example below, Alice transfers to Mouse 100 units of `time` asset:

<<<@/snippets/js-sdk-6-transfer-assets.ts

## 7. Querying for Domains, Accounts and Assets

TODO

<<<@/snippets/js-sdk-7-querying.ts#intro

::: code-group

<<<@/snippets/js-sdk-7-querying.ts#domains [Domains]

<<<@/snippets/js-sdk-7-querying.ts#accounts [Accounts]

<<<@/snippets/js-sdk-7-querying.ts#assets [Assets]

:::

## 8. Visualizing outputs in Web UI

Finally, we should talk about visualising data. The Rust API is currently
the most complete in terms of available queries and instructions. After
all, this is the language in which Iroha 2 was built.

Let's build a small Vue 3 application that uses each API we've discovered
in this guide!

::: tip

In this guide, we are roughly recreating the project that is a part of
`iroha-javascript` integration tests. If you want to see the full project,
please refer to the
[`@iroha2/client-test-web` sources](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/client/test/integration/test-web).

:::

Our app will consist of 3 main views:

- Status checker that periodically requests peer status (e.g. current
  blocks height) and shows it;
- Domain creator, which is a form to create a new domain with specified
  name;
- Listener with a toggle to setup listening for events.

You can use this folder structure as a reference:

```
╭───┬──────────────────────────────╮
│ # │             name             │
├───┼──────────────────────────────┤
│ 0 │ App.vue                      │
│ 1 │ client.ts                    │
│ 2 │ components/CreateDomain.vue  │
│ 3 │ components/Listener.vue      │
│ 4 │ components/StatusChecker.vue │
│ 5 │ config.json                  │
│ 6 │ crypto.ts                    │
│ 7 │ main.ts                      │
╰───┴──────────────────────────────╯
```

::: code-group

<<<@/snippets/js-sdk-8-config.json [config.json]

<<<@/snippets/js-sdk-8-crypto.ts [crypto.ts]

<<<@/snippets/js-sdk-8-client.ts [client.ts]

<<<@/snippets/js-sdk-8-components-StatusChecker.vue
[components/StatusChecker.vue]

<<<@/snippets/js-sdk-8-components-CreateDomain.vue
[components/CreateDomain.vue]

<<<@/snippets/js-sdk-8-components-EventListener.vue
[components/EventListener.vue]

<<<@/snippets/js-sdk-8-App.vue [App.vue]

<<<@/snippets/js-sdk-8-main.ts [main.ts]

:::

:::info

In `client.ts`, we import the configuration file like this:

```ts
import { client_config } from '../../config'
```

Note that you need to import the config in this way because this is how the
source code of this application works. You can interpret this line as
`import client_config from 'config.json'`.

:::

### Demo

Here is a small demo with the usage of this component:

<div class="border border-solid border-gray-300 rounded-md shadow-md">

![Demo of the sample Vue application](/img/sample-vue-app.gif)

</div>

## 9. Subscribing to Block Stream

You can use
[`/block/stream` endpoint](https://github.com/hyperledger/iroha/blob/iroha2-lts/docs/source/references/api_spec.md#blocks-stream)
to send a subscription request for block streaming.

Via this endpoint, the client first provides the starting block number
(i.e. height) in the subscription request. After sending the confirmation
message, the server starts streaming all the blocks from the given block
number up to the current block, and continues to stream blocks as they are
added to the blockchain.

Here is an example of how to listen to the block stream:

<<<@/snippets/js-sdk-9-blocks-stream.ts
