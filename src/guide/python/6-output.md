# 6. Visualizing outputs (Python 3)

The paradigm that Iroha chose to allow monitoring of some events is the _filter-map paradigm_. In order to know e.g. what happened to a submitted instruction we need to write some code.

First, we'll need to remember the `hash` of the transaction that we want to track, next we create a filter:

```python
filter = EventFilter.Pipeline(
    pipeline.EventFilter(
        entity=pipeline.EntityType.Transaction(),
        hash=None,
    ))
```

And add a listener on that filter. Don't worry, the `rust` side of the process is asynchronous, so barring issues with the GIL, you won't lock up your interpreter.

Note the types. The `EventFilter` is a type that filters out anything that isn't an event (and non-event types are beyond the scope of this tutorial). The `pipeline` module helps us by providing a concrete type of `EventFilter` , namely one that listens for transactions. Note that we haven't used the `hash` here.

Finally, we add a listening filter to the client.

```python
listener = cl.listen(filter)
```

Now we must actually listen for events:

```python
for event in listener:
    print(event)

    if event["Pipeline"]["status"] == "Committed" \
        and event["Pipeline"]["hash"] == hash:
        break
```

And now, we have an infinite loop that will not quit until the event gets committed. **Nobody _should_ do this in production code, and instead monitor the event queue for (at least) the possibility that the transaction gets** `Rejected`.
