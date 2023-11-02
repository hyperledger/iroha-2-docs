# Quick Start with Docker

1. Install the prerequisites:

   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker compose](https://docs.docker.com/compose/)

2. [Install Iroha from GitHub](./install.md).

3. Run `docker-compose` to bring up a network of 4 containerised peers:

   <!-- Check Docker releases: `docker compose` is going to replace `docker-compose` -->

   ```bash
   $ docker-compose up
   ```

   Depending on your set-up, this might either
   [pull the image](https://hub.docker.com/r/hyperledger/iroha2/tags) off
   of DockerHub, or build the container locally. After this process is
   complete, you'll be greeted with,

   <<< @/guide/get-started/quick-start.docker-compose-output.ansi

4. Follow the [Bash tutorial](./bash.md) to check out Iroha's capabilities.

5. When you're done with the test network, just hit `Control + C` to stop the
   containers (`⌃ + C` on Mac).

## Docker Options

You might also be interested in other options for local compilation:

- For testing Iroha code quickly, you can use `docker-compose-single.yml`,
  which starts a container with a single peer.
- For testing Iroha code in normal conditions, you can use
  `docker-compose-local.yml`, which starts 4 connected containers with
  peers.

::: info

Please note that there is ongoing work to make our configurations for
Docker even more customizable with the help of Swarm.

<!-- Check: a reference about future releases or work in progress -->

:::
