# Base Parameters

## `chain_id`

<ConfigParameterSpecs type="string" env="CHAIN_ID" />

::: code-group

```toml [Config File]
chain_id = "00000000-0000-0000-0000-000000000000"
```

```shell [ENV]
CHAIN_ID=00000000-0000-0000-0000-000000000000
```

:::

## `private_key`

<ConfigParameterSpecs type="private-key" env>
    <template #env>
        <code>PRIVATE_KEY_ALGORITHM</code> + <code>PRIVATE_KEY_PAYLOAD</code>
    </template>
</ConfigParameterSpecs>

Private key of the peer

::: code-group

```toml [Config File]
private_key = { algorithm = "ed25519", payload = "8f4c15e5d664da3f13778801d23d4e89b76e94c1b94b389544168b6cb894f84f8ba62848cf767d72e7f7f4b9d2d7ba07fee33760f79abe5597a51520e292a0cb" }
```

```shell [ENV]
PRIVATE_KEY_ALGORITHM=ed25519
PRIVATE_KEY_PAYLOAD=8f4c15e5d664da3f13778801d23d4e89b76e94c1b94b389544168b6cb894f84f8ba62848cf767d72e7f7f4b9d2d7ba07fee33760f79abe5597a51520e292a0cb
```

:::

## `public_key`

<ConfigParameterSpecs type="multihash" env="PUBLIC_KEY" />

Public key of the peer

::: code-group

```toml [Config File]
public_key = "ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9"
```

```shell [ENV]
PUBLIC_KEY=ed0120FAFCB2B27444221717F6FCBF900D5BE95273B1B0904B08C736B32A19F16AC1F9
```

:::
