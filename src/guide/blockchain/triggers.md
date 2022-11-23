# Triggers

Certain things, such as changing the state of an entity, committing a block
or [executing an Iroha Special Instruction (ISI)](#supported-isi), can emit
events, and you can attach _triggers_ to these events.

A _trigger_ is a fairly basic entity that can be registered. Just like with
Accounts, to register a trigger, you submit a `RegisterBox::Trigger`, which
contains the necessary information:

- an account ID, which should ideally be a brand new account that you
  register in the same transaction
- an executable, which itself is either a `Vec<Instruction>` or a WASM blob
- an `EventFilter`[^1], which is something that combs through all[^2]
  events and returns `true` when it finds the matching event to start the
  execution

[^1]:
    The documentation on the `EventFilter` types is under construction, as
    we are likely to make major changes to that particular architecture.
    For now, suffice it to say that you can look at the
    [source code](https://github.com/hyperledger/iroha/blob/iroha2-dev/data_model/src/events/data/filters.rs)
    in `iroha_data_model` and see a few particularly interesting
    applications.

[^2]: This behaviour is likely to change in future releases.

    <!-- Check: a reference about future releases or work in progress -->

Let's take a closer look at how triggers work.

<!-- We should probably have a Queen of Hearts here, as we have a lot of `execute`, `trigger` and `block` -->

## The Anatomy of a Trigger

A trigger has roughly the following form:

```rust
struct Trigger {
  id: TriggerId,
  action: Action,
}
```

### `Trigger.id`

The `TriggerId` is a simple wrapper around a single `Name`, a string with
no whitespaces and no reserved characters (`@`, `#`, `$`).

A typical [domain-scoped trigger](#domain-scoped-triggers) looks like
`trigger_id$domain_name`, while a bare trigger looks like `@@trigger_id`,
which makes these names easy to parse.

### `Trigger.action`

An `Action` is the heart of the trigger. It is defined like this:

```rust
struct Action {
  executable: Executable,
  repeats: Repeats,
  technical_account: AccountId,
  filter: EventFilter,
  metadata: Metadata,
}
```

#### `Action.executable`

The executable linked to this action, either a `Vec<Instruction>` or a WASM
binary.

#### `Action.repeats`

The `Repeats` is a universal enumeration of all possible repetition
schemes.

```rust
enum Repeats {
  Indefinitely,
  Exactly(u32),
}
```

#### `Action.technical_account`

A technical account is the account that would (in theory) be responsible
for the execution environment and be the authority for `Instruction`
execution.

For now, you can leave this as the account that registered the trigger. If
you have been following the tutorial, this is `alice@wonderland`. However,
later on we will show you why you'd want to create a brand new account for
those purposes.

::: info

Note that you can only use the account that already exists in order to be
able to register a new trigger.

:::

#### `Action.filter`

A filter is what determines what _kind_ of trigger you're dealing with. All
triggers respond to events, but the precise type of event that activates a
trigger depends on which `EventFilter` was used.

The reason why we chose this architecture is simple; front end code has an
abundance of event filters, and so, your knowledge of filters is
transferable to writing smart contracts.

#### `Action.metadata`

This `Metadata` is the same kind of `Metadata` that can be attached to
accounts, domains, assets, or transactions. This is the storage for trigger
data.

You can learn more about metadata in a
[dedicated section](/guide/blockchain/metadata.md).

## How Triggers Work

As we already said, the `filter` that is used to register a trigger
determines what kind of trigger this is. It is, of course, also determines
how the trigger works, e.g. when it is executed. We will go into more
details about the types of triggers in just a moment.

First, we shall point out that there two other characteristics of a trigger
that determine how this trigger works: its scope and repetition schema.

### Scope

Triggers can be scoped and un-scoped. Iroha supports both un-scoped
system-wide triggers as well as
[domain-scoped triggers](#domain-scoped-triggers). Since system-wide
triggers scan all events, and domain-scoped triggers only scane events
emitted in a certain domain, it is highly recommended to use domain-scoped
triggers where possible.

::: info

Be mindful of the limitations. Currently triggers don't check for
permissions <!-- Q: still true? -->, so they can do things your account
wouldn't be allowed to. Un-scoped triggers process _every_ event, and the
amount of work grows quadratically.

<!-- Check: a reference about future releases or work in progress -->

:::

#### Domain-scoped Triggers

While un-scoped triggers check all events of a specified type,
domain-scoped triggers only look for events in a given domain. These
triggers are more optimised compared to un-scoped triggers.

You can use [`FindTriggersByDomainId`](./queries.md#findtriggersbydomainid)
query to find triggers for the given domain.

When you register a domain-scoped trigger, you need to add the domain id to
the trigger id using `$` symbol: `my_trigger$my_domain`.

### Repetition Schema

Each such trigger can be set to repeat either `Indefinitely` or
`Exactly(n)` times, where `n` is a 32-bit integer. Once the number of
repetitions reaches zero, the trigger is gone. That means that if your
trigger got repeated exactly `n` times, you can't `Mint` new repetitions,
you have to `Register` it again, with the same name.

After a trigger is repeated for the last time, i.e. the execution count
reaches `0`, the trigger should be un-registered.

<!-- TODO: test if reaches zero needs to re-register. -->

## Types of Triggers

We shall cover the following basic types of triggers and provide you with
the detailed information on how to use each of them:

- [Data triggers](#data-triggers)
- [Time triggers](#time-triggers)
  - [Scheduled triggers](#scheduled-triggers)
  - [Pre-commit triggers](#pre-commit-triggers)
- [By-call triggers](#by-call-triggers)

All triggers are essentially **event triggers**. The type of a trigger is
determined by the type of an event that trigger is associated with. This,
in turn, is determined by the `filter` used to register a trigger.

![Untitled](/img/triggers.png)

### Data Triggers

This category includes the largest variety of triggers. The events that are
associated with this trigger type account for the vast majority of events
in Ethereum. These are data-related events, such as: an account got
registered, an asset got transferred, the Queen of Hearts decided to burn
all of her assets.

### Time Triggers

Time triggers behave slightly differently compared to data triggers. There
are two sub-types of this type: [scheduled triggers](#scheduled-triggers)
and [pre-commit triggers](#pre-commit-triggers).

Instead of processing all the events generated by normal transactions, all
time triggers process one event: the **block formation event**.

The filters of scheduled triggers are only interested in the timestamp
provided in that event, but not the block height, and not the current time.
They are executed according to a certain schedule. Pre-commit triggers, on
the other hand, are executed right before a block is committed.

#### Scheduled Triggers

When going through consensus, all peers must agree on which triggers got
executed. Scheduled triggers can't use real time, because then you can
easily create a situation when they would never agree: e.g. by giving the
`Repeats::Indefinitely` trigger a period that is smaller than the time it
takes to pass consensus. It's really that simple.

So instead of using the actual current time at each peer, we use the time
when the block got started plus a small offset. All triggers before that
point in time get executed. All triggers that would be executed after that
time wait for the next block.

::: details Why we use the offset

The reason why we add this offset has to do with Iroha being _best effort_.

Imagine if we didn't have the offset... Normally, triggers would be set to
nice round numbers; e.g. `12:00`, `12:05`, `11:55`, etc. (as opposed to
e.g. `11:59`). However, the consensus can start at any point in time and
could last a while.

Suppose that the block started to form at `11:56` and consensus finished at
`12:03` (which is optimistically quick). Let's consider different
scenarios:

- If your trigger was supposed to run at `11:55`, you'd be happy, since
  your trigger got executed just 1 minute late.
- If your trigger was supposed to run at `12:05`, it will run in the next
  block, not the one that was formed at `11:56`. If you're the author and
  you're looking at the time stamp of `12:03`, it makes sense, your trigger
  wasn't supposed to run yet.
- For the trigger scheduled for `12:00`, the situation is different. You
  look at the clock, you see `12:03`, which is when the blockchain explorer
  shows you the block data was committed, but you don't see your trigger.
  It was supposed to run, but didn't.

So, the offset is meant to anticipate when the block would get added to the
chain, so that people who were just 4 minutes early don't have to be
potentially several hours late.

Because more triggers get executed sooner, your throughput is also
infinitesimally smaller.

We could also say "you should aim to execute your trigger slightly earlier
than consensus starts", but people writing smart contracts already have too
much to worry about.

:::

#### Pre-commit Triggers

This is a variant of timed triggers that gets run before blocks with
transactions get committed. It leaves a special event to be triggered in
the next block. Effectively, it's a delayed pre-commit that can track the
behaviour of transactions in the pipeline.

::: info

These triggers are not meant for restricting the execution of transactions.

If you want to stop your users from transferring more than X amount of Y to
user Z, you really want a _permission_. While you could hack the pre-commit
triggers to emulate the desired behaviour, this is not economical neither
in terms of gas fees nor computation.

<!-- Check: a reference about future releases or work in progress -->

Until Iroha 2 supports WASM-based _permissions validators_, however, your
only choice is pre-commit triggers.

:::

### By-call Triggers

These triggers only get executed once the `CallTrigger(trigger_name)`
instruction is executed. They can be useful if you want to achieve dynamic
linkage between different smart contract modules.

Space is precious, so you want to use as little of it as you can. Thus, you
follow the UNIX design philosophy, and instead of creating one large smart
contract, you create many smaller ones, and re-use as much logic as you
can.

::: info

Of course, this is a rather exotic use case, so it shall be implemented
last.

:::

## Event Triggers by Example

Now that we've gotten the theory out of the way, we want to sit down with
the Mad Hatter, the March Hare, and the Dormouse and see if we can spin.
Let's start with an event trigger that shows the basics.

### 1. Register accounts

We have `mad_hatter@wonderland`, `dormouse@wonderland`,
`march_hare@wonderland` all of which share the fixed-point asset of
`tea#wonderland`. The Mad Hatter has the tea pot, while the rest have a
single cup of tea. When `alice@wonderland` had arrived, she got a nice cup
of tea as well.

The way we get them in Rust code looks like this:

```rust
let tea = AssetDefinitionId::new("tea", "wonderland")?;
let mad_hatter = AccountId::new("mad_hatter", "wonderland")?;
let dormouse = AccountId::new("dormouse", "wonderland")?;
let march_hare = AccountId::new("march_hare", "wonderland")?;
vec![
  RegisterBox::new(IdentifiableBox::from(NewAccount::new(mad_hatter.clone()))),
  RegisterBox::new(IdentifiableBox::from(NewAccount::new(march_hare.clone()))),
  RegisterBox::new(IdentifiableBox::from(NewAccount::new(dormouse.clone()))),
  RegisterBox::new(IdentifiableBox::from(AssetDefinition::new_fixed(tea.clone()))),
  MintBox::new(Value::Fixed(100.0_f64.try_into()?), IdBox::AssetId(AssetId::new(tea.clone(), mad_hatter.clone())))
  MintBox::new(Value::Fixed(1.0_f64.try_into()?), IdBox::AssetId(AssetId::new(tea.clone(), march_hare.clone())))
  MintBox::new(Value::Fixed(1.0_f64.try_into()?), IdBox::AssetId(AssetId::new(tea.clone(), dormouse.clone())))
  MintBox::new(Value::Fixed(1.0_f64.try_into()?), IdBox::AssetId(AssetId::new(tea.clone(), alice.clone())))
]
```

### 2. Register a trigger

We want a smart contract that transfers some `tea` from
`mad_hatter@wonderland` to `alice@wonderland` when her tea reduces by a
single cup.

For that we need to register a trigger. The boilerplate is straightforward:

```rust
let id = TriggerId::new(Name::new("refresh_tea"));

let metadata = Metadata::new();

let executable = vec![
    TransferBox::new(
      IdBox::AssetId(AssetId::new(tea.clone(), mad_hatter.clone())),
      Value::Fixed(1_f64.try_into()?),
      IdBox::AssetId(AssetId::new(alice.clone(), mad_hatter.clone())),
    )
];

let repeats = Repeats::Indefinitely;

let technical_account = mad_hatter.clone();

let filter = _ // ...
```

### 3. Define an event filter

The event filter is where we need to spend some time and think. So far
we've seen the `Pipeline` variety of filters. This time around, the filter
is a `Data` kind. This type of filter is a tuple with a single variant,
which is a `FilterOpt` of an `EntityFilter`:

- `FilterOpt` stands for Optional Filter. It can either `AcceptAll` or
  accept `BySome` of another `Filter`.
- An `EntityFilter` is a filter that matches `ByAccount` in our case, but
  can match by many other means. It wraps an `AccountFilter`, which matches
  various events produced on accounts.

What we want to do is create an event filter for when `alice@wonderland`
drinks some of her tea, or, in other words, reduces the `tea` asset by any
amount. To do this with the current API, we need to work bottom up.

An `IdFilter` is a filter that `.matches(event) == true` if and only if the
identities are exactly the same. Everything that has an `Id` has a
corresponding `IdFilter`.

::: info

An `IdFilter` is a parametric structure, an `IdFilter` that works on
`Peer`s has the type `IdFilter<PeerId>` and is not the same type as an
`IdFilter` that works with `AccountId`; `IdFilter<AccountId`.

:::

Now if we wanted a filter that will `match` whenever `tea` gets reduced,
either through a `Transfer` or a `Burn` instruction, we need an
`AssetFilter`. It needs to look at what the `Id` of the asset is, hence
`IdFilter<AssetDefinitionId>` and `ByRemoved`.

```rust
use FilterOpt::{BySome, AcceptAll};

let asset_filter = AssetFilter::new(BySome(IdFilter(tea.clone())), BySome(AssetEventFilter::ByRemoved));
```

So far so good?

Next, we want a filter that looks for changes in an asset for an account.
Specifically:

```rust
let account_filter = AccountFilter::new(BySome(IdFilter(alice.clone())), BySome(asset_filter));
```

Now, because of the way that `parity_scale_codec` works, we need to wrap
this in various boxes.

```rust
let filter = EventFilter::Data(BySome(EntityFilter::ByAccount(account_filter)));
```

### 4. Create a `Trigger` instance

After this somewhat laborious filter combination, we can create an `Action`

```rust
let action = Action {
    executable, repeats, technical_account, filter, metadata
}
```

Which allows us to create an instance of a `Trigger`.

```rust
let trigger = Trigger::new(id, action);
```

### 5. Create a transaction

Finally, in order to get said trigger onto the blockchain, we create a
transaction with the following single instruction:

```rust
Instruction::Register(RegisterBox::new(IdentifiableBox::Trigger(Box::new(trigger))));
```

### How it works

The technical details of the created transaction are summarised as follows:

- The (normal) instructions that either got submitted from WASM or directly
  from the client get executed. If there were any triggers that should have
  been registered, they get registered.
- Using the total set of events that got generated during the execution of
  instructions, the triggers (including some that got registered just this
  round) get executed.
- The events produced in the previous step get scheduled for execution in
  the next block.

::: info

The reason why the events caused by the execution of triggers get processed
in the next block is that we don't want two triggers to inadvertently cause
an infinite loop of instruction execution and break consensus.

:::

Now each time Alice drinks some tea, the Mad Hatter pours in a whole new
cup. The keen eyed among you will have noticed that the amount that Alice
drinks is irrelevant to how much tea will be transferred. Alice may take a
tiny sip and still be poured a whole new cup's worth.

::: info

We intend to address this issue in the future so that an emitted event also
has an attached `Value`. We also intend to provide more event filter types.
For example, we will have filters that match when the asset:

- Decreases by any amount (current behaviour)
- Decreases by more than (or exactly) the specific amount in one
  instruction
- Decreases to below a certain threshold

<!-- Check: a reference about future releases or work in progress -->

Only the first type of event filter is implemented now, and the other two
can be emulated using a WASM smart contract as the `Executable`.

:::

::: details Why not WASM

The above observation can be generalised. WASM can do any logic that a
Turing complete machine could, using the data available via queries. So in
theory for event-based triggers, you could create an `AcceptAll` event
filter and do all of the processing using the key-value store as persistent
storage, and then, determining if you want to execute using
easy-to-understand Rust code, and not our admittedly cumbersome,
`EventFilters`.

We don't want that. WASM takes up significantly more space, and takes
longer to execute compared to plain ISI, which are slower than
`EventFilters`. We want you to want to use the `EventFilters` because they
would make the process much more efficient, and we are working tirelessly
to make the experience of using event filters much less gruelling.

However, as was mentioned previously on several occasions, implementing a
feature properly takes time and effort. Ergonomics must be balanced against
safety and reliability, so we cannot just make things easier to use. We
want them to retain many of the advantages of strong typing.

<!-- Check: a reference about future releases or work in progress -->

This is all a work in progress. Our code is in flux. We need time to play
around with a particular implementation to optimise it.

:::

## Supported ISI

All Iroha Special Instructions work with triggers, specifically:

- `Register<Trigger>`: Create a trigger object and subscribe it to global
  events.

- `Unregister<Trigger>`: Remove a trigger from the World State View and
  stop passing events through it.

- `Mint<Trigger, u32>`: For triggers that repeat a certain number of times,
  increase the number of times that the trigger gets executed. Can be done
  from inside the executable of the trigger.

- `Burn<Trigger, u32>`: For triggers that repeat a certain number of times,
  decrease the number of times that the trigger gets executed.

::: tip

If the number provided is greater than the remaining number of repetitions,
the instruction fails to execute, and the transaction that it is part of is
rejected.

:::

You can learn more about Iroha Special Instructions in the
[dedicated section](instructions.md).

## Supported Queries

We [list supported queries](./queries.md#trigger) for triggers when we talk
in more detail about queries in the next chapter.
