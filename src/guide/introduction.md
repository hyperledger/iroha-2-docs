# Introdution

Welcome to the Hyperledger Iroha 2 tutorial. This document was designed to help you get started immediately using Iroha 2, regardless of your knowledge level of Hyperledger technology, or coding. Before the tutorial begins, here is an outline on the differences between both iterations of Iroha.

## Iroha 2 vs Iroha 1

Iroha 2 is a complete re-write of Iroha in `rust`. Iroha 2 learned in many respects from the mistakes of the original Iroha. Of particular importance is the new consensus algorithm: Sumeragi. The first version of Iroha used a consensus algorithm called Yac, which was quite difficult to reason about, in addition to being only crash-fault-tolerant. _Sumeragi_, by contrast, is also _Byzantine-fault_ tolerant.

::: info
With Sumeragi we can mathematically prove that **Iroha 2 can work when up to 33% of its nodes are actively trying to stop Iroha 2 from working properly** (_or at all_). In other words, even if someone gained control of a _third_ of all of your network nodes, **an Iroha 2 deployment is _mathematically guaranteed_ to keep working**.
:::

Iroha 2 is a small code-base. We have taken good care to ensure that we only depend on the minimum number of libraries, all of which represent the best that `rust` can offer. We provide a variety of telemetry APIs, including `prometheus` tooling, as well as structured logging, for all your monitoring needs. The data exchange makes use of a strongly-typed and versioned API, meaning that you get all of the benefits of `rust`'s incredible static guarantees. We rely on the extremely well-tested `serde` library for all of (de)serialisation, ensuring that it's fast, secure, and reliable.

We have designed our own actor framework, to both keep Iroha 2 neat, and also avoid many of the pitfalls common to asynchronous networking. Iroha 2 is smaller and more reliable than anything written using `actix`. You'd have to work pretty hard to make Iroha 2 deadlock. Iroha 2 is also more flexible than the original Iroha, and it is highly modular in its design. It should be possible to add/remove features based on the particular use-case.

If you want to be extremely fast, and work on a very small embedded piece of hardware, just compile Iroha 2 without the `expensive-metrics` feature. Don't want telemetry? Remove it. Need to have roles in your blockchain? Enable the `roles` feature. Want a permissioned blockchain? or maybe a permissionless one? You got it all in one neat little package called **Iroha 2**.

The list of Iroha 2's advantages is quite extensive. In addition to being able to enable/disable certain compilation options, you are also given the ability to implement your own smart contracts. There are currently two ways to do this:

- One is to use the Web-Assembly interface to write your logic in JavaScript. We provide a set of extremely fast instructions that cover 80% of the use-cases, from which you could build-up arbitrarily complex interactions, without compromising on performance. _If you want to learn more about smart contracts in Iroha 2, please consult our [Wiki](https://wiki.hyperledger.org/display/iroha/Scripting+Languages+and+Runtimes+for+Iroha2+Smart+Contracts)._
- Or you could make use of the Iroha 2 modules, which allow lower-level, higher performance access to the internal state of the blockchain.

Iroha 2 is written in `rust`, and uses almost all of the language's features. We deliberately avoid `panics`, `unsafe` code, as well as keeping dependencies to a minimum. We make use of trait objects sparingly, and only in cases where there's absolutely no way around them. Our code base uses `enum` types extensively, as both a means of type erasure and boxing. This is most evident in how we implemented the Iroha special instructions.

Because modules are written in `rust` you have the same guarantees on memory safety as the rest of the code-base, without compromising on the memory usage, or run-time performance. Of course, if this is not sufficiently low-level for your particular needs, you can fork Iroha, since it's licensed under the Apache 2.0 permissive license and is part of the Hyperledger Foundation, which itself is a subsidiary of the Linux foundation.

Long-term deployment of Iroha 2 networks was something that we considered very early in its development. There are **Iroha Special instructions**, that enact upgrades of the network into a consistent state. Iroha nodes can operate if other nodes in the network run different versions of the Iroha 2 binary.

Iroha 2 is also smart about when to use dynamic and when to use static linking. We dynamically link with libraries that are related to encrypting communication (like e.g. OpenSSL), but statically link against smaller `rust` libraries. Thus patching a security vulnerability in Iroha is easy for distribution maintainers: just upgrade the SSL package and Iroha will use it. At the same time Iroha has far fewer dependencies, which in turn means that far fewer packages can accidentally break Iroha during a routine distribution upgrade.

::: info

You get the best of both worlds. Patching a security vulnerability is as easy and as quick as running `sudo apt upgrade`. There are few dynamically linked libraries, so creating a functional reproducible build is a breeze.

:::

Iroha 2 makes extensive use of modern testing methods. Iroha has a 75% line coverage using just unit tests (keep in mind, line coverage includes documentation comments, some of which are also tests). There are plans to include Fuzz testing, property-based testing and failure-point testing. The formal verification of Sumeragi consensus also contributes to the fact that Iroha 2 is well tested.

## Tutorial contents

As mentioned in the introduction, this tutorial is intended for anyone to pick up and be able to perform basic functions on Iroha 2. This document contains a walk-through that covers initialising the Iroha 2, and an appendix outlining the advanced configurations.

The walkthrough includes a simple walkthrough to get Iroha2 started. Once that is completed, there is a walkthrough to setup the client. With the foundations covered, Iroha2 configuration is explained, along with step by step instructions to register a domain, then register an account within the domain. The account registering process includes an example to copy for a user, as well as generating a key pair for a new user. From there, the tutorial covers the creation and minting of assets, and finally a data output for network monitoring.

The appendix of the tutorial covers the three main files for Iroha 2 customisation, which are **Peer Configuration**, **Genesis Block** and **Client Configuration**. Picking up from a primer on public key cryptography, key pair generation while setting up a new account subsection from the first half of the tutorial left off, there is an advanced guide into keys and the cryptography implemented within them. Finally the tutorial ends with a synthesis of the entire guide, as well as important resources that can be helpful when using Iroha 2.

Before you begin this tutorial you will need:

- [git](https://githowto.com/)
- [A working Rust toolchain](https://www.rust-lang.org/learn/get-started): cargo, rust v1.57 and up\*
- [Docker](https://docs.docker.com/get-docker/)
- [Docker compose](https://docs.docker.com/compose/)

This tutorial will cover Iroha 2 in:

- Bash
- Python
- Rust
- Kotlin/Java (under construction)
- Javascript (Coming soon)
- Swift (iOS) (Coming soon)

::: info
if you’re having issues with installing rust compatible with our code (2021 edition, please consult the troubleshooting section).
:::

There will be more content added to this tutorial as it is made available, and there will be clearly marked update sections wherever they are added.

::: tip
If you are an advanced user, you can skim through the tutorial and will be able to work comfortably with Iroha 2 after a quick review of its functions, however if you are a novice user, it is recommendable to follow the practice examples provided, and iterate on the steps until you feel comfortable advancing to the next topic. Either way, we hope this document is helpful and we welcome you to provide any suggestions or feedback in the resources provided at the end of this document. For now, grab some tea and get ready to dive into the Iroha 2 rabbit hole.
:::
