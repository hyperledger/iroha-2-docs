# Iroha 2 Docs

[Read online](https://hyperledger.github.io/iroha-2-docs/).

## Contribution

### Prepare

1. **Install Node.js v16.** To install it without a headache, use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (Node Version Manager). You can run something like this:

   ```bash
   # Install NVM itself
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

   # Run it to use NVM in the current shell session or restart your shell
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
   ```

   Then you can install Node 16:

   ```bash
   nvm install 16
   ```

2. **Install PNPM**, a package manager used by this project. If you've installed Node.js, you can install PNPM with this command:

   ```bash
   npm i -g pnpm
   ```

3. **Install packages:**

   ```bash
   pnpm i
   ```

### Run dev mode

```bash
pnpm dev
```

It will start a local dev-server. You will be able to open a browser, observe rendered documentation, edit source files and see your edits on-demand.

### Documentation formatting

We use [Prettier](https://prettier.io/) to format Markdown files. Its configuration is located at `./.prettierrc.js`. Check [options reference](https://prettier.io/docs/en/options.html) for all available options.

- **Format doc files**: apply `Prettier` formatting to all Markdown files

  ```bash
  pnpm format:docs:fix
  ```

- **Check the formatting in doc files**: ensure that all documentation files match `Prettier` code style

  ```bash
  pnpm format:docs:check
  ```

## License

Iroha documentation files are made available under the Creative Commons
Attribution 4.0 International License (CC-BY-4.0), available at
http://creativecommons.org/licenses/by/4.0/
