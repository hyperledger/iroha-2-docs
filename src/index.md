# Introduction

Welcome to the Hyperledger Iroha 2 tutorial. This document is designed to help you getting started with Iroha 2, regardless of your knowledge of Hyperledger technology, coding experience or familiarity with blockchains. Before descending into the Tutorial proper, we provide an overview of the differences between Iroha 1 and Iroha 2 for users upgrading from the previous version.

## Iroha 2 vs. Iroha 1

Iroha 2 is a complete re-write of Hyperledger Iroha in Rust. As of writing the two projects are developed concurrently. While Iroha 1 development is in a less active phase due to it being feature-complete, and widely used, it is not being abandoned.

Iroha 2 learned in many respects from the original Iroha. Of particular importance is the new consensus algorithm: Sumeragi. The first version of Iroha used a consensus algorithm called Yac. It is a _crash-fault-tolerant_, which means that it can survive a set number of nodes crashing, e.g. losing power, being cut off from the network, being destroyed. _Sumeragi_, by contrast, was designed to be _Byzantine-fault-tolerant_. This means that Iroha 2 can tolerate not only peers being inactive on the network, but also running malicious software, and actively trying to falsify data in the blockchain.

::: info
We can mathematically prove that **Iroha 2 can work when up to 33% of its nodes are actively trying to stop Iroha 2 from working properly** (_or at all_). In other words, even if someone gained control of a _third_ of all of your network nodes, an Iroha 2 deployment is _mathematically guaranteed_ to keep working.
:::

Iroha 2 is a minimal code base. We take great care to vet our dependencies, and avoid large inter-dependent chunks of code. We provide a few telemetry APIs, including `prometheus` tooling, structured logging in JSON, as well as compatibility with standard tools used in substrate. Our data is strongly typed, and avoids dynamic dispatch. We make use of the best that Rust can offer: we use `serde` and `parity_scale_codec` for serialisation, `tokio` for co-operative multithreading, as well as judicious auditing. Our code is easy to reason about, and quick to compile.

We have designed our own actor framework, to both keep Iroha 2 neat and also avoid many of the pitfalls common to asynchronous networking. Consequently, Iroha 2 is smaller and more reliable than anything written using `actix`. It's very hard to make Iroha 2 hang or deadlock, you can trust us, we tried. As Iroha 2 is written in Rust, and uses the language's features to great effect. We avoid `panics` and `unsafe` code. Our code base uses `enum` types extensively, as both a means of type erasure and boxing.

Iroha 2 is also more flexible than the original Iroha, and it is highly modular in its design. It should be possible to add/remove features based on the particular use-case.  If you want to be extremely fast, and work on a very small embedded piece of hardware, just compile Iroha 2 without the `expensive-metrics` feature. Don't use telemetry at all? Remove it. Need to have roles in your blockchain? Enable the `roles` feature. Want a permissioned blockchain? or maybe a permissionless one? You got it all in one neat little package called **Iroha 2**.

Of course, if this is not sufficiently low-level for your particular needs, you can fork Iroha, since it's licensed under the Apache 2.0 permissive license and is part of the Hyperledger Foundation, which itself is a subsidiary of the Linux foundation.

Iroha 2 is an event-driven blockchain. Each change in the state of the blockchain is accompanied by its own event that can trigger a smartcontract: complex logic that allows for on-chain scripting. For smartcontracts, Iroha 2 supports two approaches.

- Iroha Special Instructions
- WASM

The first approach is useful when you want very simple transparent logic, and want to minimise the footprint in the blockchain. All interactions with the _World state_, the state of the blockchain at this point in time, has to be done using the aforementioned instructions. There is also rudimentary support for domain-specific conditional logic. However sometimes you might want to run something more complex, e.g. do some complex conditional evaluation. For this purpose, you can use the provide WASM support library, and write the logic in any language that supports compilation to WASM. You still have to use the Iroha Special instructions to e.g. mint or transfer assets, as well as register entities in the blockchain, however, you might need more complex metadata-driven logic, that would be cumbersome to build up from ISI.



::: info

Iroha 2 at this point is not feature-complete. While we more-less finished the consensus, we still haven't finalised many of the architectural decisions. For example, the means by which one could write a smartcontract is likely to be extended.

:::

_If you want to learn more about smartcontracts in Iroha 2, please consult our [Wiki](https://wiki.hyperledger.org/display/iroha/Scripting+Languages+and+Runtimes+for+Iroha2+Smart+Contracts)._

<!-- Long-term deployment of Iroha 2 networks was something that we considered very early in its development. There are **Iroha Special instructions**, that enact upgrades of the network into a consistent state. Iroha nodes can operate if other nodes in the network run different versions of the Iroha 2 binary. -->

Iroha 2 is also smart about when to use dynamic and when to use static linking. We dynamically link with libraries that are related to encrypting communication (like e.g. OpenSSL), but statically link against smaller Rust libraries. Thus patching a security vulnerability in Iroha is easy for distribution maintainers: just upgrade the SSL package and Iroha will use it. At the same time Iroha has far fewer dependencies, which in turn means that far fewer packages can accidentally break Iroha during a routine distribution upgrade.

::: info

You get the best of both worlds. Patching a security vulnerability is as easy as running `sudo apt upgrade`. On the other hand, only security-critical dependencies are linked dynamically, so most of Iroha is built statically and reproducibly.

:::

Iroha 2 is extensively tested. Despite being in active development, Iroha has a 75% line coverage (keep in mind, line coverage includes documentation comments, some of which are also tests). There are plans to include Fuzz testing, property-based testing and failure-point testing.

The list of headlining features goes on. As the Iroha 2 development continues, this guide will be extended and headlining features will be added to this section.

## Tutorial preamble

What follows is an introduction suitable for both experienced developers, prospective users, and people casually curious about blockchain technology. We provide a level of detail, sufficient for you to not need anything else, though we do refer you to standard documentation in a few cases.

We shall walk you through starting an Iroha network, either with docker (recommended) or using one of the provided scripts, and then introduce you to the client libraries. We shall then take a small detour into the basic concepts of Iroha special instructions, and how they interact with the world state. 

The _appendix_  covers the three main configuration files: the _peer_ configuration and the _genesis block_, which you need to get right to start a network; and the _client_ configuration, which you adjust in order to interact with the blockchain. 

For this tutorial, you will need:

- [git](https://githowto.com/)
- [A working Rust toolchain](https://www.rust-lang.org/learn/get-started): cargo, rust v1.57 and up [^1]
- (Optional) [Docker](https://docs.docker.com/get-docker/)
- (Optional) [Docker compose](https://docs.docker.com/compose/) [^2]

[^1]: If you’re having issues with installing rust compatible with our code (2021 edition), please consult the troubleshooting section.
[^2]: We highly recommend using docker, because it's oftentimes simpler and easier to use. 

This tutorial will cover Iroha 2 in:

- Unix Shell (bash)
- Python
- Rust
- Kotlin/Java
- JavaScript (TypeScript)
- Swift (iOS) (coming soon)

There will be more content added to this tutorial as it is made available, and there will be clearly marked update sections wherever they are added.

::: tip

This tutorial is aimed at both advanced users as well as novices. Advanced users can typically skip the 0-th subscetions of each section, while novices are advised to follow the instructions closely and not skip any steps. Although some questions can be answered with a quick google search, we gathered the most common mistakes and troubleshooting steps such that even people without prior experience in programming can follow along.

:::
