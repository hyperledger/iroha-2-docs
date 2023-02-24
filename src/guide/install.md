# Install Iroha 2

To install Iroha, follow these instructions:

1. [Choose the Iroha 2 version to work with](#choose-version)
2. [Install prerequisites](#install-prerequisites)
3. [Install Iroha from GitHub](#install-iroha-from-github)

## Choose Version

You can choose to work with one of the following versions of Iroha: `dev`,
`lts`, or `stable`:

|     Version     |                                                                                                                                                        Description                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iroha2-dev`    | This is the latest state of Iroha and it is **not meant to be used in production**. This is an intermediate, untested, potentially broken state, and therefore we cannot guarantee that it is usable or stable.                                                                                                            |
| `iroha2-stable` | This is the latest released version of Iroha. Stable versions are tested and released once a month, in accordance with our release schedule. You can use the stable version in production, and we will offer you tech support.                                                                                             |
| `iroha2-lts`    | This is the long-term supported version. We guarantee its compatibility with SDKs, toolsets, and block stores released when it came out. We **recommend using the LTS version in production** since it is the version that will not change much over time. Similarly to the stable version, we offer tech support for LTS. |

## Install Prerequisites

To install Iroha from GitHub, you need:

- [git](https://githowto.com/)
- [OpenSSL](https://www.openssl.org/)

### Install OpenSSL

Make sure you have OpenSSL installed. Note that in most Linux setups it is
already available to you.

- Install OpenSSL on Ubuntu:

  ```bash
  sudo apt-get install libssl-dev
  ```

- Install OpenSSL on macOS using [brew](https://brew.sh/):

  ```bash
  brew install openssl
  ```

Check the
[OpenSSL installation guide](https://github.com/openssl/openssl/blob/master/INSTALL.md)
for details.

## Install Iroha from GitHub

1.  If you haven’t already, you might want to create a clean folder for
    Iroha 2, to keep things tidy.

    ```bash
    mkdir -p ~/Git
    ```

    ::: tip

    On macOS, if you get
    `fatal: could not create work tree dir 'iroha': Read-only file system`,
    that’s because the home folder is not a real file system. The fix is to
    create the `Git` folder.

    :::

2.  Enter the directory you have just created using

    ```bash
    cd ~/Git
    ```

3.  Then `clone` the Iroha git repository into the folder `~/Git/iroha` and
    `checkout` the branch you prefer to work on. You can use the
    `iroha2-lts` branch, which is the long-term support release, or the
    latest stable release branch (`iroha2-stable`). To clone the repository
    and checkout the stable release, run:

    ```bash
    git clone https://github.com/hyperledger/iroha.git --branch iroha2-stable
    ```

    This will fetch all of Iroha, including Iroha 1, and the `iroha2-dev`
    branch, which we will touch upon later.

## What's next

- [Run Iroha in Docker](./quick-start.md)
- [Build Iroha 2 client](build.md)
