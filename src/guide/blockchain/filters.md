# Filters

Iroha uses _filter-map paradigm_ to monitor events. Let's look at different
types of filters that can be used in Iroha.

## Data Filters

A data filter is a tuple with a single variant, which is a `FilterOpt` of
an `EntityFilter`:

![Untitled](/img/data_filters.png)

`FilterOpt` stands for Optional Filter. It can either `AcceptAll` or accept
`BySome` of another `Filter`. An `EntityFilter` is a filter that matches
events produced by a certain type entity, e.g. by account or domain.

Here is the list of `EntityFilter`s in Iroha:

![Untitled](/img/entity_filters.png)
