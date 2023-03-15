import type { SnippetSourceDefinition } from './types'

/**
 * hyperledger/iroha#iroha2-stable
 */
const IROHA_REV_STABLE = 'iroha2-stable'

/**
 * hyperledger/iroha#iroha2-dev
 */
const IROHA_REV_DEV = 'iroha2-dev'

/**
 * hyperledger/iroha-javascript#iroha2
 */
const IROHA_JS_REV = 'd59fc767ddf0d1a66f5c6914a9be1560f614d791'

/**
 * hyperledger/iroha-java#iroha2-dev
 */
const IROHA_JAVA_REV_DEV = 'iroha2-dev'

// *****

const javascriptSnippets = [
  {
    src: 'packages/docs-recipes/src/1.client-install.ts',
    local: '1-client-install.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.1.1.key-pair.ts',
    local: '2-1-1-key-pair.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.1.2.signer.ts',
    local: '2-1-2-signer.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.2.1.torii-usage-example.ts',
    local: '2-2-1-torii-usage-example.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.2.2.torii-pre-node.ts',
    local: '2-2-2-torii-pre-node.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.2.3.torii-pre-web.ts',
    local: '2-2-3-torii-pre-web.ts',
  },
  {
    src: 'packages/docs-recipes/src/2.3.client.ts',
    local: '2-3-client.ts',
  },
  {
    src: 'packages/docs-recipes/src/3.register-domain.ts',
    local: '3-register-domain.ts',
  },
  {
    src: 'packages/docs-recipes/src/4.register-account.ts',
    local: '4-register-account.ts',
  },
  {
    src: 'packages/docs-recipes/src/5.1.register-asset.ts',
    local: '5-1-register-asset.ts',
  },
  {
    src: 'packages/docs-recipes/src/5.2.mint-registered-asset.ts',
    local: '5-2-mint-asset.ts',
  },
  {
    src: 'packages/docs-recipes/src/6.transfer-assets.ts',
    local: '6-transfer-assets.ts',
  },
  {
    src: 'packages/docs-recipes/src/7.query-domains-accounts-assets.ts',
    local: '7-querying.ts',
  },
  {
    src: 'packages/client/test/integration/test-web/src/main.ts',
    local: '8-main.ts',
  },
  {
    src: 'packages/client/test/integration/config/client_config.json',
    local: '8-config.json',
  },
  {
    src: 'packages/client/test/integration/test-web/src/App.vue',
    local: '8-App.vue',
  },
  {
    src: 'packages/client/test/integration/test-web/src/client.ts',
    local: '8-client.ts',
  },
  {
    src: 'packages/client/test/integration/test-web/src/crypto.ts',
    local: '8-crypto.ts',
  },
  {
    src: 'packages/client/test/integration/test-web/src/components/CreateDomain.vue',
    local: '8-components-CreateDomain.vue',
  },
  {
    src: 'packages/client/test/integration/test-web/src/components/StatusChecker.vue',
    local: '8-components-StatusChecker.vue',
  },
  {
    src: 'packages/client/test/integration/test-web/src/components/EventListener.vue',
    local: '8-components-EventListener.vue',
  },
  {
    src: 'packages/docs-recipes/src/9.blocks-stream.ts',
    local: '9-blocks-stream.ts',
  },
].map<SnippetSourceDefinition>(({ src, local }) => ({
  src: `https://raw.githubusercontent.com/hyperledger/iroha-javascript/${IROHA_JS_REV}/${src}`,
  filename: `js-sdk-${local}`,
}))

// *****

export default [
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha/${IROHA_REV_STABLE}/MAINTAINERS.md`,
    filename: 'iroha-maintainers-at-stable.md',
  },
  {
    src: './src/example_code/lorem.rs',
  },

  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha/${IROHA_REV_DEV}/configs/client_cli/config.json`,
    filename: 'client-cli-config.json',
  },
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha/${IROHA_REV_DEV}/configs/peer/config.json`,
    filename: 'peer-config.json',
  },
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha/${IROHA_REV_DEV}/configs/peer/genesis.json`,
  },
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha/${IROHA_REV_DEV}/client/examples/tutorial.rs`,
    filename: 'tutorial-snippets.rs',
  },

  ...javascriptSnippets,

  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha-java/${IROHA_JAVA_REV_DEV}/modules/test-tools/src/main/kotlin/jp/co/soramitsu/iroha2/testengine/IrohaConfig.kt`,
  },
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha-java/${IROHA_JAVA_REV_DEV}/modules/client/src/test/kotlin/jp/co/soramitsu/iroha2/InstructionsTest.kt`,
  },
  {
    src: `https://raw.githubusercontent.com/hyperledger/iroha-java/${IROHA_JAVA_REV_DEV}/modules/client/src/test/java/jp/co/soramitsu/iroha2/JavaTest.java`,
  },
] satisfies SnippetSourceDefinition[]
