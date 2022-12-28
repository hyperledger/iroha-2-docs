# Troubleshooting Configuration Issues

This section offers troubleshooting tips for issues with Iroha 2
configuration. Make sure you
[checked the keys](./overview.md#check-the-keys) first, as it is the most
common source of issues in Iroha.

If the issue you are experiencing is not described here, contact us via
[Telegram](https://t.me/hyperledgeriroha).

## Outdated genesis on a Docker-compose setup

When you are using the Docker-compose version of Iroha, you might encounter the issue of one of the peer containers failing with the `Failed to deserialize raw genesis block` error. This happens if there is a mismatch between Iroha versions, meaning an Iroha peer cannot be initialized with the given genesis file.

If one of the peers is failing and it's been a while since you pulled the Iroha code for the first time, it's safe to assume the outdated genesis file is the cause. Here is how you can make sure Iroha is working incorrectly for exactly this reason:

1. Use `docker ps` to check the current containers. Depending on the version, you will see either `hyperledger/iroha2:dev` or `hyperledger/iroha2:lts` containers. Check the number of Iroha peer containers in the `docker ps` output. By default, there are 4 peers configured in `docker-compose.yml` for Iroha, although you may have changed that value. You will see that the first container that should have been running Iroha just exited with an error, while three other containers remain active.

2. Check the logs and look for the `Failed to deserialize raw genesis block` error. If you started your Iroha in daemon mode with `docker compose up -d`, use `docker compose logs` command.

The way to troubleshoot such an issue depends on the use of Iroha.

If this is a basic demo and you don't need the peer data to be restored, you can simply reset the genesis file to its latest state. To do this, use the `git checkout configs/peer/genesis.json` command.

If you need to restore the Iroha instance data, do the following:

1. Connect the second Iroha peer that will copy the data from the first (failed) peer.
2. Wait for the new peer to synchronize the data with the first peer.
3. Leave the new peer active.
4. Update the genesis file of the first peer.

::: info

The features needed to monitor the copying progress between peers and a migration tool to update the genesis file are to be implemented in future releases.

:::