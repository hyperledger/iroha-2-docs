# Glossary <!-- omit in toc -->

Here you can find definitions of all Iroha-related entities.

- [Asset](#asset)
- [Byzantine fault-tolerance (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Components](#iroha-components)
  - [Sumeragi (Emperor)](#sumeragi-emperor)
  - [Torii (Gate)](#torii-gate)
  - [Kura (Warehouse)](#kura-warehouse)
  - [Kagami(Teacher and Exemplar and/or looking glass)](#kagamiteacher-and-exemplar-andor-looking-glass)
  - [Merkle tree (hash tree)](#merkle-tree-hash-tree)
  - [Smart contracts](#smart-contracts)
  - [Triggers](#triggers)
  - [Versioning](#versioning)
  - [Hijiri (peer reputation system)](#hijiri-peer-reputation-system)
- [Iroha Modules](#iroha-modules)
- [Iroha Special Instructions (ISI)](#iroha-special-instructions-isi)
  - [Utility Iroha Special Instructions](#utility-iroha-special-instructions)
  - [Core Iroha Special Instructions](#core-iroha-special-instructions)
  - [Domain-specific Iroha Special Instructions](#domain-specific-iroha-special-instructions)
  - [Custom Iroha Special Instruction](#custom-iroha-special-instruction)
- [Iroha Query](#iroha-query)
- [View change](#view-change)
- [World state view (WSV)](#world-state-view-wsv)
- [Leader](#leader)

## Asset

A representation of a valuable object on the blockchain. More on assets
[here](/guide/blockchain/assets.md).

## Byzantine fault-tolerance (BFT)

The property of being able to properly function with a network containing a
certain percentage of malicious actors. Iroha is capable of functioning
with up to 33% malicious actors in its peer-to-peer network.

## Iroha Components

Rust modules containing Iroha functionality.

### Sumeragi (Emperor)

The Iroha module responsible for consensus.

### Torii (Gate)

Module with the incoming request handling logic for the peer. It is used to
receive, accept and route incoming instructions, and HTTP queries, as well
as run-time configuration updates.

### Kura (Warehouse)

Persistence-related logic. It handles storing the blocks, log rotation,
block storage folder rotation, etc.

### Kagami(Teacher and Exemplar and/or looking glass)

Generator for commonly used data. It can generate cryptographic key pairs,
genesis blocks, documentation, etc.

### Merkle tree (hash tree)

A data structure used to validate and verify the state at each block
height. Iroha's current implementation is a binary tree. See
[Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) for more details.

### Smart contracts

Smart contracts are blockchain-based programs that run when a specific set
of conditions is met. In Iroha smart contracts are implemented using
[core Iroha special instructions](#core-iroha-special-instructions).

### Triggers

An event type that allows invoking an Iroha special instruction at specific
block commit, time (with some caveats), etc. More on triggers
[here](/guide/blockchain/triggers.md).

### Versioning

Each request is labelled with the API version to which it belongs. It
allows a combination of different binary versions of Iroha client/peer
software to interoperate, which in turn allows software upgrades in the
Iroha network.

### Hijiri (peer reputation system)

Iroha's reputation system. It allows prioritising communication with peers
that have a good track-record, and reducing the harm that can be caused by
malicious peers.

## Iroha Modules

Third party extensions to Iroha that provide custom functionality.

## Iroha Special Instructions (ISI)

A library of smart contracts provided with Iroha. These can be invoked via
either transactions or registered event listeners. More on ISI
[here](/guide/blockchain/instructions.md).

#### Utility Iroha Special Instructions

This set of [isi](#iroha-special-instructions-isi) contains logical
instructions like `If`, I/O related like `Notify` and compositions like
`Sequence`. They are mostly used by
[custom instructions](#custom-iroha-special-instructions).

### Core Iroha Special Instructions

[Special instructions](#iroha-special-instructions-isi) provided with every
Iroha deployment. These include some
[domain-specific](#domain-specific-iroha-special-instructions) as well as
[utility instructions](#utility-iroha-special-instructions).

### Domain-specific Iroha Special Instructions

Instructions related to domain-specific activities: assets, accounts,
domains, peer management). These provide the tools necessary to make
changes to the [World State View](#world-state-view-wsv) in a secure and
safe manner.

### Custom Iroha Special Instruction

Instructions provided in [Iroha Modules](#iroha-modules), by clients or 3rd
parties. These can only be built using
[the Core Instructions](#core-iroha-special-instructions). Forking and
modifying the Iroha source code is not recommended, as special instructions
not agreed-upon by peers in an Iroha deployment will be treated as faults,
thus peers running a modified instance will have their access revoked.

## Iroha Query

A request to read the World State View without modifying said view. More on
queries [here](/guide/blockchain/queries.md).

## View change

A process that takes place in case of a failed attempt at consensus.
Usually this entails the election of a new [Leader](#leader).

## World state view (WSV)

In-memory representation of the current blockchain state. This includes all
currently loaded blocks, with all of their contents, as well as peers
elected for the current epoch.

## Leader

In an iroha network, a peer is selected randomly and granted the special
privilege of forming the next block. This privilege can be revoked in
networks that achieve
[Byzantine fault-torelance](#byzantine-fault-tolerance-bft) via
[view change](#view-change).
