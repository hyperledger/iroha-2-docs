# Introduction

Welcome to the Hyperledger Iroha 2 tutorial. This document is designed to
help you get started with Iroha 2, regardless of your knowledge of
Hyperledger technology, coding experience or familiarity with blockchains.

::: tip

If you have previously worked with Iroha, start with our comparison of
[Iroha 1 and Iroha 2](./guide/iroha-2.md). That will help you understand
the differences between the two versions and upgrade to the newer one.

:::

## Preamble

This tutorial is suitable for both experienced developers, prospective
users, and people casually curious about blockchain technology. The level
of detail is sufficient so that you wouldn't need any supplementary guide.
However, should you want to learn more, we have more detailed documentation
in the works.

In this guide, we shall

- walk you through starting an Iroha network, either with docker
  (recommended) or using one of the provided scripts;
- introduce you to the client libraries;
- take a small detour into the basic concepts of Iroha special
  instructions, and how they interact with the world state.

## Navigation

We invite you to follow the tutorial in this order:

0. If you are already familiar with Hyperledger Iroha, read about
   [the differences](./guide/iroha-2.md) between two versions of Iroha.
1. [Build and install Iroha 2](./guide/build-and-install.md), then follow
   one of the language-specific guides to learn how to set up and configure
   Iroha 2, register a domain and an account, register and mind assets, and
   visualize outputs:
   - [Bash](./guide/bash.md)
   - [Python](./guide/python.md)
   - [Rust](./guide/rust.md)
   - [Kotlin/Java](./guide/kotlin-java.md)
   - [Javascript (TypeScript)](./guide/javascript.md)
2. Dive into more advanced topics to deepen your understanding of Iroha 2:
   - Check the
     [features that make Iroha truly special](./guide/advanced/intro.md).
   - Learn in greater detail about Iroha 2
     [configuration and management](./guide/configure/intro.md).
3. Use Iroha 2 in a more advanced mode:
   - [Run Iroha on bare metal](./guide/advanced/running-iroha-on-bare-metal.md).

## Tutorial Updates

The current iteration of the Iroha 2 tutorial is a constant work in
progress. We are updating the tutorial with each release to reflect the
state of Iroha and the newly added features. While we do our best to keep
this tutorial up to date, it can go out of sync by a few days or maybe a
week.

In the future this tutorial will have sections dedicated to:

- permissions
- multi-signature accounts and transactions
- custom permission validators
- permission groups

We will also cover peer management in greater detail: adding and removing
peers, maintaining a healthy network, and troubleshooting the issues that
you might have in your real-world application.

## Learn More

::: info

For more information on Iroha 2, please take a look at the
[Iroha 2 Whitepaper](https://github.com/hyperledger/iroha/blob/2.0.0-pre.1.rc.1/docs/source/iroha_2_whitepaper.md),
as well as the Hyperledger Iroha section within the
[Hyperledger Foundation Wiki](https://wiki.hyperledger.org/display/iroha).

:::

::: tip

If you want to contribute to Hyperledger Iroha, please look at our
[Contributing Guide](https://github.com/hyperledger/iroha/blob/iroha2-dev/CONTRIBUTING.md).

:::
