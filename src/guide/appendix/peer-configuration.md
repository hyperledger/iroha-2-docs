# Peer Configuration

The peer configuration JSON `/configs/peer/config.json` is the file that determines how your blockchain operates: we won't look at it now, but the only things that you need to worry about are the `TRUSTED_PEERS` , the `KURA` `BLOCK_STORE_PATH` and the `TORII` `P2P_ADDR` and `API_ADDR`.
The `PUBLIC_KEY` and `PRIVATE_KEY` options will be covered at a later stage. The remaining options are for tuning Iroha, so you don't want to touch them unless you know what you're doing.
