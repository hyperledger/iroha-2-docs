# Iroha 2 Docs

[Read online](https://hyperledger.github.io/iroha-2-docs/).

## Developing

### Prerequisites

**Installed Node.js is required.** To install it without a headache, use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (Node Version Manager). You can run something like this:

```bash
# Install NVM itself
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Run it to use NVM in the current shell session or restart your shell
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Install latest Node
nvm install --lts
```

If you have already installed Node.js, **you need to install PNPM** (package manager that is used within this project). To do so, just run this:

```bash
npm i -g pnpm
```

If you have everything installed, run in the project root the following command to install packages:

```bash
pnpm i
```

That's it!

### Local dev-hot-reload mode

```bash
pnpm dev
```

This will start a local dev-server so you can open a browser and observe documentation and see your edits on-demand.

### Format Markdown

```bash
pnpm format:docs
```
