# Advanced Topics

This is the part of the tutorial where we say "you're not a newbie anymore"
and hit you hard with the features that make Iroha truly special.

Here we cover in some breadth the [Iroha special instructions](./isi.md),
[Web-assembly](./wasm.md), and how both are used in creating what's known
as a _smart contract_. We also explain the [triggers](./triggers.md),
[queries](./queries.md), and [permissions](./permissions.md) in detail.

## How Iroha works

To understand how Iroha operates, let's draw parallels between a blockchain
and a computer. If the blockchain is the computer, then in this metaphor of
ours the client binary (for example: `iroha_client_cli`) is the keyboard,
the blockchain is the hard drive, and the Iroha peer software is the
processor. Like a processor, Iroha accepts portable instructions that
modify what's written to the blockchain, allow certain users to use the
network, and lock others out.

Any operation that is run on-chain is written in terms of
[Iroha Special Instructions (ISI)](./isi.md), and there is no other way of
modifying the world state. To understand why, we'll need to make a short
detour into how Iroha is implemented under the hood.

Each interaction with the blockchain is done via a _transaction_. A
transaction is a collection of _instructions_, which are either glued
together in sequence or compiled into what we affectionately call a
[WASM](wasm.md) blob. You need these instructions to register an account,
remove an account, add X amount of Y currency, and so on.

To read the information encoded in the blocks of a blockchain (the current
world state), you use [queries](./queries.md). Queries are submitted like
instructions, but they're not tracked and recorded in blocks, so they're
much more lightweight. If you use queries as part of complicated logic
(e.g. inside WASM), they have a non-negligible impact on the size of the
blocks. Queries that are only used to get information leave no trace in the
blockchain.

## Consensus

Each time you send a transaction to Iroha, it gets put into a queue. When
it's time to produce a new block, the queue is emptied, and the consensus
process begins. This process is equal parts common sense and black
magic[^1].

The mundane aspect is that a special set of peers needs to take the
transaction queue and reproduce the same world state. If the world state
cannot be reproduced for some reason or another, none of the transactions
get committed to a block.

The consensus starts over from scratch by choosing a different special set
of peers. This is where the black magic comes in. There is a number of
things that are fine-tuned: the number of peers in the voting process, the
way in which subsequent voting peers are chosen, and the way in which the
peers communicate that consensus has failed. Because this changes the view
of the world, the process is called a _view change_. The exact reason for
why the view was changed is encoded in the _view change proof_, but
decoding that information is an advanced topic that we won't cover here.

The reasoning behind this algorithm is simple: if someone had some evil
peers and connected them to the existing network, if they tried to fake
data, some good™ peers would not get the same (evil™) world state. If
that's the case, the evil™ peers would not be allowed to participate in
consensus, and you would eventually produce a block using only good™ peers.

As a natural consequence, if any changes to the world state are made
without the use of ISI, the good™ peers cannot know of them. They won't be
able to reproduce the hash of the world state, and thus consensus will
fail. The same thing happens if the peers have different instructions.

[^1]:
    For prospective wizards, the
    [Iroha 2 Whitepaper](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/iroha_2_whitepaper.md)
    is a good start.
