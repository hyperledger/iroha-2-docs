# 3. Registering a Domain (JavaScript)

Here we see how similar the JavaScript code is to the `rust` counterpart. It should be emphasised that the JavaScript library is a thin wrapper: It doesn’t provide any special builder structures, meaning you have to work with bare-bones compiled Data Model structures and define all internal fields explicitly. Doubly so, since JavaScript employs many implicit conversions, we highly recommend that you employ typescript. This makes many errors far easier to debug, but unfortunately results in more boiler-plate.

Let’s register a new domain with the name `looking_glass` our current account: _alice@wondeland_.

```ts
import { Client } from '@iroha2/client'
import { KeyPair } from '@iroha2/crypto-core'
import {
  AccountId,
  Expression,
  IdentifiableBox,
  Instruction,
  OptionU32,
  QueryBox,
  QueryPayload,
  RegisterBox,
  TransactionPayload,
  Value,
} from '@iroha2/data-model'

const client: Client = /* snip */ ___
const KEY_PAIR: KeyPair = /* snip */ ___
const ACCOUNT_ID = AccountId.defineUnwrap({
  name: 'Alice',
  domain_name: 'Wonderland',
})
```

To register a new domain, we need to submit a transaction with one instruction: to register a new domain. Let’s wrap it all in an async function:

```ts
async function registerDomain(domainName: string) {
  const registerBox = RegisterBox.defineUnwrap({
    object: {
      expression: Expression.variantsUnwrapped.Raw(
        Value.variantsUnwrapped.Identifiable(
          IdentifiableBox.variantsUnwrapped.Domain({
            name: domainName,
            accounts: new Map(),
            metadata: {
              map: new Map(),
            },
            asset_definitions: new Map(),
          }),
        ),
      ),
    },
  })

  const instruction = Instruction.variantsUnwrapped.Register(registerBox)

  const payload = TransactionPayload.defineUnwrap({
    account_id: ACCOUNT_ID,
    instructions: [instruction],
    time_to_live_ms: 100_000n,
    creation_time: BigInt(Date.now()),
    metadata: new Map(),
    nonce: OptionU32.variantsUnwrapped.None,
  })

  await client.submitTransaction({
    payload: TransactionPayload.wrap(payload),
    signing: KEY_PAIR,
  })
}
```

Which we use to register the domain like so:

```ts
await registerDomain('looking_glass')
```

We can also ensure that new domain is created using Query API. Let’s create another function that wraps that functionality:

```ts
async function ensureDomainExistence(domainName: string) {
  const result = await client.makeQuery({
    payload: QueryPayload.wrap({
      query: QueryBox.variantsUnwrapped.FindAllDomains(null),
      timestamp_ms: BigInt(Date.now()),
      account_id: ACCOUNT_ID,
    }),
    signing: KEY_PAIR,
  })

  const domain = result
    .as('Ok')
    .unwrap()
    .as('Vec')
    .map((x) => x.as('Identifiable').as('Domain'))
    .find((x) => x.name === domainName)

  if (!domain) throw new Error('Not found')
}
```

Now you can ensure that domain is created by calling:

```ts
await ensureDomainExistence('looking_glass')
```
