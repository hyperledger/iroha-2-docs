# 1. Iroha 2 Client Setup (bash)

Note, first, that we have already created the `iroha_client_cli` binary executable, when we ran the build (**TODO link to a command block?**) _command_.

Create a fresh directory for the client

```bash
mkdir -p test_docker
```

Copy the configuration file to the client directory

```bash
cp ./configs/client_cli/config.json test_docker/
```

::: tip

You could also use a file manager (e.g. finder) to do that. We prefer providing command-line instructions, because it's easier to follow step-by-step.

:::

To test Iroha 2's metadata capabilities, let's also create a dummy `metadata.json` file.

```bash
echo '{"comment":{"String": "Hello Meta!"}}' > test_docker/metadata.json
```

To get the CLI started, copy the `iroha_client_cli` binary into the client directory

```bash
cp ./target/debug/iroha_client_cli test_docker/
```

Make sure you (**TODO link to 0 tutor**) _bring up the test network_ as well.
