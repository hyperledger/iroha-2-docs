# Launch Iroha 2

Once you have Iroha 2 installed on your machine, you are ready to set up an instance of the Iroha 2 network.

To do so, perform the following steps:

1. Install the prerequisites:

   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker Compose](https://docs.docker.com/compose/)

2. [Install Iroha](./install-iroha.md).

3. Navigate to the local repository root directory.

4. Run the `docker compose` command with the `docker-compose.yml` network configuration file specified to deploy a network of four containerized peers: <!-- TODO: consider explaining what a network configuration file is, where to find it and how to customize it -->

   ```bash
   $ docker compose -f defaults/docker-compose.yml up
   ```

   Depending on your setup, this might either [pull the image](https://hub.docker.com/r/hyperledger/iroha2/tags) from Docker Hub or build the container locally.\
   Once the process is complete, an output similar to the following is generated:

   <<< @/guide/get-started/launch-iroha.docker-compose-output.ansi

Once the network is deployed, it is possible to interact with it using Iroha Client CLI.

To discover its capabilities and learn to perform some of the basic operations, see [Operate Iroha via CLI](./operate-iroha-via-cli.md).

::: tip

You can monitor blockchain events in the terminal where the test network runs.

:::

## Docker Options

The following options are also available for local compilation:

- To test Iroha code quickly, use `docker-compose-single.yml`, which starts a container with a single peer.
- To test Iroha code in normal conditions, you can use `docker-compose-local.yml`, which starts four connected containers with peers.

::: tip Note

There is ongoing work to make our configurations for Docker even more customizable with the help of Swarm.

<!-- Check: a reference about future releases or work in progress -->

:::
