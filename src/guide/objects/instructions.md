# Instructions

In the table below we present you with a summary of Iroha Special
Instructions (ISI). For each instruction, there is a list of objects on
which this instruction can be run on. For example, only assets can be
transferred, while minting can refer to assets, triggers, and permission
tokens.

Some instructions require a destination to be specified. For example, if
you transfer assets, you always need to specify to which account you are
transferring them. On the other hand, when you registering something, all
you need is the object that you want to register.

::: info

We discuss the place of ISI in the blockchain when we talk about
[how Iroha operates](../advanced/intro.md#how-iroha-works). Refer to the
[chapter on Iroha Special Instructions](../advanced/isi.md) for more
details about supported instructions.

:::

| Instruction                                                                | Objects                                                                                                               | Destination |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------- |
| [Register/Unregister](../advanced/isi.md#unregister)                       | accounts, domains, asset definitions, triggers, roles, peers                                                          |             |
| [Mint/Burn](../advanced/isi.md#mintburn)                                   | assets, triggers (trigger repetitions), permission tokens                                                             | accounts    |
| [SetKeyValue/RemoveKeyValue](../advanced/isi.md#setkeyvalueremovekeyvalue) | any objects that have [metadata](./metadata.md): accounts, domains, assets, asset definitions, triggers, transactions |             |
| [Grant/Revoke](../advanced/isi.md#grantrevoke)                             | [roles, permission tokens](../advanced/permissions.md)                                                                | accounts    |
| [Transfer](../advanced/isi.md#transfer)                                    | assets                                                                                                                | accounts    |
| [ExecuteTrigger](../advanced/isi.md#executetrigger)                        | triggers                                                                                                              |             |
| [If, Pair, Sequence](../advanced/isi.md#composite-instructions)            | any instructions                                                                                                      |             |

There is also another way of looking at ISI, i.e. in terms of the target of
each instruction. For example, when you register an account, you do so
within a certain domain. This means that the _target_ of the
`Register<Account>` instruction would be the domain within which it is
being registered.

| Target  | Instructions                                                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account | (un)register assets, mint/burn account public key, mint/burn account signature condition check, update account metadata, grant/revoke a permission token, grant/revoke role |
| Domain  | (un)register accounts, (un)register asset definitions, update asset metadata, update domain metadata                                                                        |
| Asset   | update metadata, mint/burn, transfer                                                                                                                                        |
| Trigger | (un)register, mint/burn trigger repetitions, execute trigger                                                                                                                |
| World   | (un)register domains, peers, roles                                                                                                                                          |
