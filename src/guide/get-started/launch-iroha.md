# Launch Iroha 2

Once you have Iroha 2 installed on your machine, you are ready to set up an instance of the Iroha network.

## Prerequisites

To launch an instance of the Iroha network, the following must be installed first:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Launch Iroha Network

1. In your terminal, navigate to the root directory of your local [`iroha`](https://github.com/hyperledger/iroha) repository:

   ```bash
   $ cd ~/Git/iroha
   ```

2. Run the `docker compose` command with the `docker-compose.yml` network configuration file specified to deploy a network of four containerized peers: <!-- TODO: consider explaining what network configuration file are, where to find them and how to customize them -->

   ```bash
   $ docker compose -f defaults/docker-compose.yml up
   ```

   Depending on your setup, this might either pull an image from [Docker Hub]((https://hub.docker.com/r/hyperledger/iroha2/tags)) or build the container locally.\
   Once the process is complete, an output similar to the following is generated:

   <<< @/guide/get-started/launch-iroha.docker-compose-output.ansi

Once the network is deployed, it is possible to interact with it using Iroha Client CLI.

To discover its capabilities and learn to perform some of the basic operations, see [Operate Iroha via CLI](./operate-iroha-via-cli.md).

::: tip

You can monitor blockchain events in the terminal where the network runs.

:::

### Docker Options

The following options are also available for local compilation:

- To test Iroha code quickly, use the `docker-compose-single.yml` network configuration file, which starts a container with a single peer.
- To test Iroha code in normal conditions, use the `docker-compose-local.yml` network configuration file, which starts four connected containers with peers.

::: tip Note

There is ongoing work to make our configurations for Docker even more customizable with the help of Swarm.

<!-- Check: a reference about future releases or work in progress -->

:::
