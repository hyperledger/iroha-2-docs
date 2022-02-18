# Client Configuration

This tutorial will not go in detail about the options you can adjust with the client configuration settings, instead we will provide a broad overview of what is available in Iroha2.
First, the `TORII_API_URL` is the same as `TORII` `API_ADDR` in the peer configuration. You should also add either `http://` or (_preferably_) `https://` to the address. If you are setting up an Iroha peer, you should probably set up a domain for public blockchains, while bare sockets are enough for a local private deployment. The `ACCOUNT_ID` should be self-explanatory: the only thing you need to worry about, is that the account must exist in the blockchain. In the example `genesis.json`, you can see how we've set *alice@*wonderland up.
