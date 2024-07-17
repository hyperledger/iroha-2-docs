# Launch Iroha

1. Install the prerequisites:

   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker compose](https://docs.docker.com/compose/)

2. [Install Iroha](./install.md).

3. Run `docker compose` and specify the network configuration file to bring up a network of 4 containerized peers:

   ```bash
   $ docker compose -f configs/swarm/docker-compose.yml up
   ```

   Depending on your set-up, this might either
   [pull the image](https://hub.docker.com/r/hyperledger/iroha2/tags) from DockerHub, or build the container locally. After this process
   completes, you'll receive the following output:

   <<< @/guide/get-started/launch-iroha.docker-compose-output.ansi

4. Proceed to the [CLI tutorial](./operate-iroha-via-cli.md) to check out Iroha's capabilities.

5. When you're done with the test network, just hit `Control + C` to stop the
   containers (`⌃ + C` on Mac).

## Docker Options

You might also be interested in other options for local compilation:

- To test Iroha code quickly, you can use `docker-compose-single.yml`,
  which starts a container with a single peer.
- For testing Iroha code in normal conditions, you can use
  `docker-compose-local.yml`, which starts 4 connected containers with
  peers.

::: info

Please note that there is ongoing work to make our configurations for
Docker even more customizable with the help of Swarm.

<!-- Check: a reference about future releases or work in progress -->

:::

## What's Next

Now that you have Iroha up and running, proceed to the [CLI tutorial](/guide/get-started/operate-iroha-via-cli) to learn how to work with it.