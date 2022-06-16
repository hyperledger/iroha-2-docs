import { defineConfig, UserConfig, DefaultTheme } from 'vitepress'
import Windi from 'vite-plugin-windicss'
import footnote from 'markdown-it-footnote'
import customHighlight from './plugins/highlight'
import path from 'path'

async function themeConfig() {
  const cfg: UserConfig = {
    markdown: {
      highlight: await customHighlight(),
    } as any,
  }
  return cfg
}

function getNav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      link: '/',
      activeMatch: '^/$|^/guide/',
    },
  ]
}

function getGuideSidebar(): DefaultTheme.SidebarGroup[] {
  return [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Introduction',
          link: '/',
        },
        {
          text: 'Iroha 2 vs. Iroha 1',
          link: '/guide/iroha-2',
        },
        {
          text: 'Build and Install',
          link: '/guide/build-and-install',
        },
      ],
    },
    {
      text: 'Language-specific guides',
      items: [
        {
          text: 'Bash',
          link: '/guide/bash',
        },
        {
          text: 'Python 3',
          link: '/guide/python',
        },
        {
          text: 'Rust',
          link: '/guide/rust',
        },
        {
          text: 'Kotlin/Java',
          link: '/guide/kotlin-java',
        },
        {
          text: 'JavaScript',
          link: '/guide/javascript',
        },
      ],
    },
    {
      text: 'Advanced Topics',
      items: [
        {
          text: 'Introduction',
          link: '/guide/advanced/intro',
        },
        {
          text: 'Iroha Special Instructions',
          link: '/guide/advanced/isi',
        },
        {
          text: 'Web Assembly',
          link: '/guide/advanced/wasm',
        },
        {
          text: 'Triggers',
          link: '/guide/advanced/triggers',
        },
        {
          text: 'Queries',
          link: '/guide/advanced/queries',
        },
      ],
    },
    {
      text: 'Configuration and Management',
      items: [
        {
          text: 'Introduction',
          link: '/guide/configure/intro',
        },

        {
          text: 'Peer Configuration',
          link: '/guide/configure/peer-configuration',
        },
        {
          text: 'Client Configuration',
          link: '/guide/configure/client-configuration',
        },
        {
          text: 'Genesis Block',
          link: '/guide/configure/genesis',
        },
        {
          text: 'Keys',
          link: '/guide/configure/keys',
        },
        {
          text: 'Peer Management',
          link: '/guide/configure/register-unregister',
        },
      ],
    },
    {
      text: 'Advanced Mode',
      items: [
        {
          text: 'Iroha On Bare Metal',
          link: '/guide/advanced/running-iroha-on-bare-metal',
        },
      ],
    },
  ]
}

export default defineConfig({
  extends: themeConfig,
  base: process.env.PUBLIC_PATH ?? '',
  srcDir: 'src',
  title: 'Hyperledger Iroha 2 Tutorial',
  description:
    'Documented tutorial for Hyperledger Iroha 2 outlining the main differences between Iroha versions along with a walkthrough and additional resources.',
  lang: 'en-US',
  vite: {
    plugins: [Windi({ config: path.resolve(__dirname, '../windi.config.ts') })],
  },
  lastUpdated: true,

  // TODO add favicon
  // head: [],

  markdown: {
    config(md) {
      md.use(footnote)
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Iroha 2',

    socialLinks: [{ icon: 'github', link: 'https://github.com/hyperledger/iroha-2-docs' }],

    editLink: {
      pattern: 'https://github.com/hyperledger/iroha-2-docs/edit/main/src/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdatedText: 'Last Updated',

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/': getGuideSidebar(),
    },
    nav: getNav(),

    algolia: {
      appId: 'V04UIXRXW5',
      apiKey: 'df91faea581b3b5145f676e262d5afc8',
      indexName: 'hyperledger',
    },
  },
})
