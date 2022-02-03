# 6. Visualizing outputs (JavaScript)

Finally, we should talk about visualising data. The Rust API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built.

Let's build simple Vue 3 Listener component that uses Events API to catch pipeline events and renders them!

::: info

The example above uses Composition API + `<script setup>` syntax.

:::

In our component we will render a button to toggle listening state, and a list with registered events. Our events filter is set up to catch any transaction status change.

```ts
import { SetupEventsReturn } from '@iroha2/client'
import {
  EntityType,
  EventFilter,
  OptionEntityType,
  OptionHash,
} from '@iroha2/data-model'
import { shallowReactive, shallowRef, computed } from 'vue'
import { bytesToHex } from 'hada'

// Let's assume that you already have initialized client
import { client } from '../client'

// Where and how to store collected events

type EventData = {
  hash: string
  status: string
}

const events = shallowReactive<EventData[]>([])

const currentListener = shallowRef<null | SetupEventsReturn>(null)

const isListening = computed(() => !!currentListener.value)

async function startListening() {
  currentListener.value = await client.listenForEvents({
    filter: EventFilter.wrap(
      EventFilter.variantsUnwrapped.Pipeline({
        entity: OptionEntityType.variantsUnwrapped.Some(
          EntityType.variantsUnwrapped.Transaction,
        ),
        hash: OptionHash.variantsUnwrapped.None,
      }),
    ),
  })

  currentListener.value.ee.on('event', (event) => {
    const { hash, status } = event.unwrap().as('Pipeline')

    events.push({
      hash: bytesToHex([...hash]),
      status: status.match({
        Validating: () => 'validating',
        Committed: () => 'committed',
        Rejected: (_reason) => 'rejected with some reason',
      }),
    })
  })
}

function stopListening() {
  currentListener.value?.close()
  currentListener.value = null
}
```

And finally, our component’s template:

```html
<div>
  <p>
    <button v-if="isListening" @click="stopListening">
      Stop listening
    </button>
    <button v-else @click="startListening">Listen</button>
  </p>

  <p>Events:</p>

  <ul>
    <li v-for="{ hash, status } in events">
      Transaction
      <code>{{ hash }}</code> status: {{ status }}
    </li>
  </ul>
</div>
```
