# 1. Iroha 2 Client Setup (Python 3)

There are two versions of Iroha python to choose from. In theory, the Iroha 1 version of Iroha Python (that also has the best documentation) should be compatible with an Iroha 2 deployment.

Thus we should build and install the Iroha 2 compatible version of Iroha-python, using (for now) its GitHub repository.

Let's create a separate folder for Iroha python and clone its GitHub repository into it.

```bash
cd ~/Git/
git clone https://github.com/hyperledger/iroha-python/tree/iroha2
```

We need the `iroha2` branch

```bash
cd ~/Git/iroha-python
git checkout iroha2
```

Iroha Python is written in `rust`, using the PyO3 library. Thus, unlike most python packages, you must build it first.

```bash
pip install maturin
maturin build
```

After the build is complete, you may then install it into your system.

```bash
pip install ./target/wheels/iroha_python-*.whl
```

Finally, you will need a working client configuration:

```bash
cp -vfr ~/Git/iroha/configs/client_cli/config.json example/config.json
```

::: tip

You can also use the provided `config.json` in the `example` folder, if you also call `docker compose up` from that same folder. This has to do with the fact that the configuration for the docker files in Iroha python is slightly different.

:::
