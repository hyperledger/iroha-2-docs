# 2. Configuring Iroha 2 (JavaScript)

The JavaScript Client is fairly low-level in the sense that it doesn’t expose any convenience features like a `TransactionBuilder` or a `ConfigBuilder`. Work on implementing those is underway, and these features will very likely be available with the second round of this tutorial’s release. Thus, on the plus side: configuration of the client is simple, on the negative side you have to prepare a lot is done manually.

A basic client setup looks straightforward:

```ts
import { Client } from '@iroha2/client'

const client = Client.create({
  torii: {
    // specify it if you want to use Transactions API,
    // Query API, Events API or health check
    apiURL: 'http://127.0.0.1:8080',

    // specify it if you want to perform status check
    statusURL: 'http://127.0.0.1:8081',
  },
})
```

That's enough to perform health or status check, but if you need to use transactions or queries, you’ll need to prepare a key pair.

Let's assume that you have stringified public & private keys, more on that later. Thus, a key-pair generation could look like this:

```ts
import { crypto } from '@iroha2/crypto-target-node'
import { KeyPair } from '@iroha2/crypto-core'

// just some package for hex-bytes transform
import { hexToBytes } from 'hada'

function generateKeyPair(params: {
  publicKeyMultihash: string
  privateKey: {
    digestFunction: string
    payload: string
  }
}): KeyPair {
  const multihashBytes = Uint8Array.from(
    hexToBytes(params.publicKeyMultihash),
  )
  const multihash = crypto.createMultihashFromBytes(multihashBytes)
  const publicKey = crypto.createPublicKeyFromMultihash(multihash)
  const privateKey = crypto.createPrivateKeyFromJsKey(params.privateKey)

  const keyPair = crypto.createKeyPairFromKeys(publicKey, privateKey)

  // don't forget to "free" created structures
  for (const x of [publicKey, privateKey, multihash]) {
    x.free()
  }

  return keyPair
}

const kp = generateKeyPair({
  publicKeyMultihash:
    'ed0120e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3',
  privateKey: {
    digestFunction: 'ed25519',
    payload:
      'de757bcb79f4c63e8fa0795edc26f86dfdba189b846e903d0b732bb644607720e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3',
  },
})
```
