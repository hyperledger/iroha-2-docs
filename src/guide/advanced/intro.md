# Advanced Topics

This is the part of the tutorial, where we say "you're not a newbie anymore" and hit you hard with the features that make Iroha truly special. Here we will cover in some breadth the _Iroha special instructions_, Web-assembly, and how both are used in creating what's know as a _smart contract_.

 The basic premise is; if the blockchain is the computer, then `iroha_client_cli` or any of the client libraries for that matter, are the keyboard, the blockchain is the hard drive, and the Iroha peer software is the processor. Like a processor, Iroha accepts portable instructions which modify what's written to the blockchain, allow certain users to use the network, and lock out others.

As such any operation that is run on-chain is written in terms of Iroha Special Instructions (ISI), and there is no other way of modifying the world state that would pass consensus. To understand why, we'll need to make a short detour into how Iroha is implemented under the hood.

Each interaction with the blockchain is done via a _transaction_. It's a collection of instructions, either glued together in sequence or called from a WASM blob (more on that later), that can register an account, remove an account, add X amount of Y currency etc. There are also queries, which return some values that you are allowed to access, which are also instructions. Each time you send a transaction to Iroha, it gets put into a queue, and when the time comes, the queue is emptied, and the consensus process begins. This process is a bit of mundane with a bit of black magic[^1]. The mundane, is that a special set of peers needs to take the transaction queue, and reproduce the same world state. If the world state cannot be reproduced for some reason or another, none of the transactions get committed to a block and consensus tries again. The reasoning behind this algorithm is simple: if someone had some evil peers and connected them to the existing network, if they tried to fake data, some good™ peers would not get the same (evil™) world state. If that's the case, the evil™ peers would not be allowed to participate in consensus, and you would eventually produce a block using only good™ peers. So if any changes to the world state are made without using ISI, they would not pass consensus and never get committed to a block.

## Iroha Special Instructions

So what kinds of ISI do we have? If you've read the tutorial on Rust or Python, you've already seen a couple of instructions: `Register<Account>` and `Mint<Quantity>`. For the exhaustive list of Instructions you should probably consult our source code, however, here are some important classes.

### (Un)Register

Instructions used to give an ID to a new entity on the blockchain. Everything that can be registered is `Identifiable`, but not everything that's `Identifiable` can be registered. As a rule, everything that can be registered, can also be un-registered, but that is not a hard and fast rule.

You can register a new account, a new asset definition a peer and a trigger (more on them later). Registering a peer is currently the only way of adding peers that were not part of the original `TRUSTED_PEERS` array to the network.

Registering an account is different. Iroha can be compiled in two modes: _public_ and _private_. If it's compiled with _private_ permissions, to register an account, you need an account. This is the default. If you want your users to be able to register without access to a pre-existing account, you need to compile Iroha in the _public_ mode.

::: info

As of writing, the set of public blockchain permissions is incomplete, and as such Iroha source code needs to be modified to run it in the _public_ mode.

:::

### Mint/Burn

Can refer to assets, trigger uses (if the trigger has a limited number of repetitions), as well as temporary permission tokens. Some assets can be declared as non-mintable, meaning that any attempt to mint them post-registration will result in an error.

::: info

This will be changed in RC3.

:::

Assets and permissions tokens need to be minted to a specific account, usually the one that registered the asset in the first place. All assets are assumed to be non-negative as well, so you can never have `-1.0` of `time` or `Burn` a negative amount and get a `Mint`.

### Grant/Revoke

These are used specifically for permissions. When minting a permission token a user is granted `X` amount of permissions to do `Y` which will expire once all `X` operations were performed. By contrast, a `Grant` operation can be used to grant either a single permission, or a group of permissions (or a "role"), to a user permanently. As such these instructions should be used carefully.


### SetKeyValue/RemoveKeyValue

These instructions are used with the key/value store asset type. This use case has not received much attention so far, because storing data in the blockchain is rather advanced topic that we shall cover separately.

### Query

These are all the queries that can be made from the client side. This is not necessarily the only kind of information that is available on the network, but it's the only kind of information that is guaranteed to be accessible on all networks. Telemetry data is optional to the specific deployment of Iroha. Access to your account balance is required function.

### Expressions, Conditionals, Logic

All ISI operate on expressions. Each expression has an `EvaluatesTo` which is used in instruction execution. While you could specify the account name directly, you could also specify the account ID via some mathematical or string operation. You can check if an account is registered on the blockchain too.

Using expressions which implement `EvaluatesTo<bool>`, you can set up conditional logic and execute more sophisticated operations on-chain. For example, you can submit a `Mint` instruction only if a specific account is registered. Recall that you can combine this with queries, and as such can program the blockchain to do some amazing stuff. This stuff is what we refer to as _smart contracts_, and is the main defining feature of advanced usage of blockchain technology.

## WASM

While we had initially assumed that all operations within Iroha will be handled with instructions and conditionals, there are a few problems with this approach.

    1. The ISI syntax is verbose and ugly.
    2. The ISI syntax is not familiar for most programmers.
    3. While ISI smart contracts are compact (usually a few bytes), they need to be hand-optimised.

In the long run, all of these problems are taken care of by using a **domain-specific language**, which gets optimised and compiled into a sequence of instructions that executes fast, and takes very little space in the blocks, but is also easy to understand. Something that looks like your traditional `if` statements and `for` loops.

However, in the interim, we have decided to use another portable binary standard called **Web assembly** or **WASM**. The main advantage of this format is that you can use any language you like (as long as it links statically against our helper library), and produce a 32-bit portable executable. The compilers take care of the optimisation, and you don't have to learn a new language (ahem… solidity… ahem), just to operate on the blockchain.

You'd still need to use ISI from inside your WASM binary to do anything on-chain, but you can do other things, and write e.g. Rust instead of composing Generic `structs` inside a macro to get conditional logic. Moreover, as long as you fit within the limits of WASM runtime, and the provided libraries, you can do anything (and everything) you want.

The drawback is that this process is a tad more involved than just writing the ISI using the client libraries.


### Simple Rust Smart Contract

WASM projects, just like any other binary in Rust need to be separate crates. Don't worry, it doesn't have to be big.

To get started you might want to use
```bash
cargo new --lib
```
to create a new project. Yes, we need the `lib` type, more on that later.

The `Cargo.toml` of the project should look something like this:

```toml
[package]
name  = "smartcontract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ['cdylib']

[dependencies]
iroha_wasm = { git = "https://github.com/hyperledger/iroha/", branch = "iroha2" }
```

Note that the crate type is `cdylib`. Most Rust code is linked in a non-portable architecture and OS-specific static manner, but WASM is a portable format. Since C ABI is the *lingua franca* of the programming world and there is no other stable Rust ABI (yet), Iroha relies on the C-linkage to generate WASM bindings. Thankfully, you don't need to worry about foreign function interface (FFI)-related problems like `unsafe`, `repr(C)`, padding, alignment etc., `iroha_wasm` takes care of all that for you.

`iroha_wasm` is the crate that contains all of the bindings, macros and trait implementations that you'd need to write the program, most notably the `iroha_wasm` attribute macro. The crate also exposes our `data_model` which contains all of the basic ISI and types. `parity-scale-codec` is (as of today) the chosen serialisation format with a strong possibility of getting replaced with a different (custom) serialisation format in the near future, as it seems to dominate the binary size[^2].

Now that we have the preliminaries nailed down, we get to write some code for our smart contract. In the `src/lib.rs` you should write the following:


```rust
#![no_std]
#![no_main]

extern crate alloc;

use alloc::vec::Vec;

use iroha_wasm::data_model::prelude::*;

#[iroha_wasm::iroha_wasm]
fn smartcontract_entry_point(_account_id: AccountId) {
    let query = QueryBox::FindAllDomains(FindAllDomains {});
    let domains: Vec<Domain> = query.execute().try_into().unwrap();

    for domain in domains {
        let new_account_id = AccountId {
            name: Name::new("mad_hatter").unwrap(),
            domain_id: domain.id,
        };

        Instruction::Register(RegisterBox::new(NewAccount::new(new_account_id))).execute();
    }
}
```

`cargo run --release` will submit the instruction and run it for you (be sure to have a peer up).


What this smart contract does is query all of the currently existing domains, put the results into a `std::vec::Vec`, which in this case has to be imported from `alloc`, as we use `no_std` (more on that later), which is then used to add the user named `mad_hatter` to all of the existing domains.

Building the same logic out of `Expression` and `If` and `Sequence` would be significantly harder. Moreover, the actual low-level instructions that would run are very likely not going to be as well-optimised as what the compiler produces.



### Advanced Smart Contracts: Optimising for Size

WASM smart contracts can get big. So big, in fact, that we might not let you store them in the blockchain. So how do you reduce the size? The most important modifications are done in `Cargo.toml`:

```toml

[profile.release]
strip = "debuginfo" # Remove debugging info from the binary
panic = "abort"     # Panics are transcribed to Traps when compiling for wasm anyways
lto = true          # Link-time-optimisation produces notable decrease in binary size
opt-level = "z"     # Optimise for size vs speed with "s"/"z"(removes vectorization)
codegen-units = 1   # Further reduces binary size but increases compilation time
```

Rust stores a lot of debug information (even when compiled in `release` mode), which is (as the name suggests) used for debugging a panic in your Rust application. As you would expect, this information increases the size of the compiled WASM significantly. Normally, this would be a worthwhile trade-off, but not in our case. Firstly, since the WASM is stored on-chain, it will be permanently recorded in some block and take space on every full node of an Iroha network (which by the way, stores a lot of its information in RAM), so storage space for WASM is at a premium. Secondly, once the WASM smart contract is stored on-chain, the debug information is no longer accessible. Indeed, you shouldn't debug on a peer. Instead, you should replicate the conditions that caused the panic locally and debug on your personal machine.

Another step that we've already taken involves working under a `no_std` environment. All of our size-related woes stem from Rust being predominantly statically linked. As such, breaking the standard library into more manageable crates, like using `alloc::vec` instead of `std::vec` can help us reduce the size and compilation time[^3].

Next, you're advised to re-compile `libcore` and any other standard library crate (e.g. `alloc`) to exclude the leftover panic-related code that comes with prebuilt the `core` library[^4]:

```bash
cargo +nightly build -Z build-std -Z build-std-features=panic_immediate_abort --target wasm32-unknown-unknown
```

Unfortunately, this is an unstable feature. In other words, the developers of the Rust programming language can decide to change how this works, or remove this option entirely.

Finally, you can use an automated tool to optimise the size of the WASM using [`wasm-opt`](https://github.com/WebAssembly/binaryen), or use [`twiggy`](https://rustwasm.github.io/twiggy/) to guide your manual optimisation efforts. Using `wasm-opt` is highly advised because it will often significantly reduce your binary size, e.g.:
```bash
wasm-opt -Os -o output.wasm input.wasm
```

At some, point, unfortunately, the smallest size of your WASM blob is going to be determined by the libraries that you need to use. Using all of the above steps on the provided smart contract, can reduce it down to a manageable (for the blockchain) size. Stay tuned for RC3 for further optimisations of binary size.

[^1]: For prospective wizards, the whitepaper is a good start (TODO: link).
[^2]: Size is an important metric. We shall cover size-optimisation strategies as we go.
[^3]: It should be noted, that excluding the standard library is necessary for compiling to the wasm32 target, and is thus mandatory.
[^4]: `wasm-opt` can also be used to remove the debug sections.


## Triggers

The basic premise is that certain things can emit events: it could be a change of the state of some entity, e.g. an account, and/or a domain (you can't modify an account without changing the domain that it belongs to, but you can change the domain without touching any of its accounts), but it could also be the block being committed, some point in time being crossed, or even a direct signal emitted by executing a special ISI. All of these are events that triggers can be attached to.

A trigger is a fairly basic entity that can be registered. Just like with Accounts, you submit a `RegisterBox::Trigger`, which contains the necessary information. This information is a single account ID, which should ideally be a brand new account that you register in the same transaction (but for now it doesn't matter); an executable, which itself is either a `Vec<Instruction>` or a WASM blob; and an `EventFilter`, something which combs through (at this point all) events and returns `true` when it finds an event that you like to start the execution.

The documentation on the `EventFilter` types is under construction, as we are likely to make major changes to that particular architecture. For now, suffice it to say that you can look at the source code in `iroha_data_model` and see a few particularly interesting applications.
