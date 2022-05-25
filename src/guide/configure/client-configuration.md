# Client Configuration

This tutorial will not go in detail about the options you can adjust with
the client configuration settings. Instead, we will provide a broad
overview of what is available in Iroha 2.

First, the `TORII_API_URL` is the same as `TORII` `API_ADDR` in the
[peer configuration](peer-configuration.md). You should also add either
`http://` or (_preferably_) `https://` to the address.

If you are setting up an Iroha peer, you should set up a domain for public
blockchains. Bare sockets are enough for a local private deployment.

The `ACCOUNT_ID` should be self-explanatory: the only thing you need to
worry about, is that the account must exist in the blockchain. In the
[example `genesis.json`](genesis.md), you can see how we set up the
_alice_@wonderland account.
