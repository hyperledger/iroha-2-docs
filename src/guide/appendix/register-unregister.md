# Registering and Unregistering peers


## Public Blockchain

With any luck, if you followed the guide, you have a well-functioning network that people want to join. Naturally, in a public blockchain, joining is a matter of installing the correct software and waiting until your node gets discovered.

::: info

Peer discovery is under construction.

:::

## Private Blockchain

In a bank setting, allowing everyone to join at their leisure is a security nightmare. For safety, automatic discovery of peers is turned off for Iroha 2 in the private blockchain configuration. To add a peer to the network, it must be manually registered. To do that, the user that registers the peer must have the appropriate `PermissionToken`. This could be granted as part of a `role`, or as part of a one-time allowance. Granting roles makes sense if a user is to serve as an administrator of sorts, where it's their responsibility to maintain the peers in the network long-term. A one-time permission grant is useful when the party registering the peer isn't responsible for registering peers in general, but the network administrator doesn't need to (or want to) spend time setting up a new peer.

::: info

Permissions for registering a peer are under construction.

:::

After permissions, the new peer must be set up. It's a good idea to request some information about the peers' configuration in the network. Your best friend is the `configuration` endpoint of the API socket. Thus far querying is done only manually. In the next release we plan to implement a [bootstrapping procedure](https://github.com/hyperledger/iroha/issues/1184 "#1184"), but for now you'll have to manually check that the timeouts and batch sizes match. To simplify the process, you can ask the network administrator for a redacted version of `config.json`, which excludes privileged information, such as `PRIVATE_KEY`s.


_After_ your peer is running. You should submit the _register peer_ instruction. The peer will go through the handshake process and start chatting with the network.

::: tip

Submitting a `Register<Peer>` instruction **doesn't** (and cannot) instantiate a _new peer process_. 

:::


What about unregistering peers? For security reasons this process is one-sided. The network reaches consensus that it wants to remove a peer, but the peer itself doesn't know much about why nobody's talking to it. We might add an optional feature that will detect if the `Unregister<Peer>` instruction contains the public key of the peer itself and remove the connection from all other peers, but this is not suitable for all cases. In most circumstances, if you want to unregister a peer, you want to do so, because it is a Byzantine fault. Just "ghosting" this peer makes the life of the malicious actor on the network harder. 
