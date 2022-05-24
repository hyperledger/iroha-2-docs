# Iroha 2 vs. Iroha 1

Iroha 2 is a complete re-write of Hyperledger Iroha in Rust. As of writing
the two projects are developed concurrently.

## Fault Tolerance

Iroha 2 learned a great deal from the development of the original Iroha. Of
particular importance is the new and improved Byzantine-fault-tolerant
consensus algorithm: _Sumeragi_. This new consensus allowed us to expand
what could be done on a blockchain, without any security risks.

::: info

The first version of Iroha used a consensus algorithm called _Yac_. It is
_crash-fault-tolerant_, which means that it can survive a set number of
nodes _crashing_: i.e. losing power, being cut off from the network, or
being destroyed with a sledgehammer. _Sumeragi_, by contrast, was designed
to be _Byzantine-fault-tolerant_. This means that Iroha 2 can tolerate not
only peers being inactive on the network, but also running malicious
software, and actively trying to falsify data in the blockchain.

We can mathematically prove that **Iroha 2 can work when up to 33% of its
nodes are actively trying to stop Iroha 2 from working properly** (_or at
all_). In other words, even if someone gained control of a _third_ of all
of your network nodes, an Iroha 2 deployment is _mathematically guaranteed_
to keep working.

:::

## Minimalist Code Base

Iroha 2 is a minimalist code base. We take great care to vet our
dependencies, and avoid large inter-dependent chunks of code. We provide a
few telemetry APIs, including `prometheus` tooling, structured logging in
JSON, as well as compatibility with
[standard tools](https://wiki.sora.org/sora-faq) used in Parity Substrate.
Our data is strongly-typed, and our methods — statically dispatched. We
make use of the best that Rust has to offer: `serde` and
`parity_scale_codec` for serialisation, `tokio` for co-operative
multi-threading, as well as wealth of testing, bench-marking, static
analysis and code auditing tools that come packaged with the exemplary
`cargo`. Our code is easy to reason about, and quick to compile, whilst
also being ergonomic to use and thoughtfully crafted. We have no `panics`
and no `unsafe` code.

## Flexibility

Iroha 2 is also more flexible than the original Iroha due to modular
design. It is possible to add or remove features based on the particular
use-case. If you want to be extremely fast, and work on embedded hardware,
just compile Iroha 2 without the `expensive-metrics` feature. Don't use
telemetry at all? Remove it entirely and enjoy even more performance.
_Permission_ sets are plugins that can be upgraded during run-time. We have
an extensive module system as well as a robust WASM runtime framework.

## Smart Contracts

Iroha 2 is an event-driven ledger. Each change in the state of the
blockchain is necessarily accompanied by its own event that can _trigger_ a
smartcontract: complex logic designed for use in on-chain scripting.

For smart contracts, Iroha 2 supports two approaches:

- [Iroha Special Instructions (ISI)](./advanced/isi.md)
- [Web ASseMbly (WASM)](./advanced/wasm.md)

The first approach is useful when you want very simple transparent logic,
and want to minimise the footprint in the blockchain. All interactions with
the _World state_, that is, the state of the blockchain at this point in
time, has to be done using the aforementioned instructions. There is also
rudimentary support for domain-specific conditional logic.

If you want to learn more about smartcontracts in Iroha 2, please consult
our
[Wiki](https://wiki.hyperledger.org/display/iroha/Scripting+Languages+and+Runtimes+for+Iroha2+Smart+Contracts).

<!-- Long-term deployment of Iroha 2 networks was something that we considered very early in its development. There are **Iroha Special instructions**, that enact upgrades of the network into a consistent state. Iroha nodes can operate if other nodes in the network run different versions of the Iroha 2 binary. -->

## Static and Dynamic Linking

Iroha 2 smartly chooses when to use dynamic linking. This strikes a balance
between it being easy to patch a Critical security vulnerability in a
vendored library like OpenSSL, but also remaining reproducible and portable
across platforms, architectures and deployments.

::: info

You get the best of both worlds. Patching a security vulnerability is as
easy as running `sudo apt upgrade`. On the other hand, only
security-critical dependencies are linked dynamically, so it is highly
unlikely that any of the smaller and less important libraries can break
Iroha after an upgrade.

:::

## Testing

Iroha 2 is extensively tested. Despite being in active development, Iroha
has 80% line coverage (keep in mind, line coverage includes documentation
comments, some of which are also tests). There are plans to include Fuzz
testing, property-based testing and failure-point testing to ensure that
Iroha is reliable.

The list of headlining features goes on. As we are nearing our first
long-term supported preview release, we'll be updating the guide with
relevant changes.
