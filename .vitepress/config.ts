import { defineConfigWithTheme, UserConfig } from 'vitepress'
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

function getNav() {
  return [
    {
      text: 'Guide',
      link: '/',
      activeMatch: '^/$|^/guide/',
    },
    // {
    //   text: 'API',
    //   link: '/api/',
    // },
  ]
}

function getGuideSidebar() {
  return [
    {
      text: 'Getting started',
      children: [
        {
          text: 'Introduction',
          link: '/',
        },
        {
          text: 'Build and Install',
          link: '/guide/build-and-install',
        },
      ],
    },
    {
      text: 'Language-specific guides',
      children: [
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
      text: 'Conclusions',
      link: '/guide/conclusions',
    },
    {
      text: 'Advanced Guides',
      link: 'guide/advanced/intro',
      children: [
        {
          text: 'Web Assembly',
          link: '/guide/advanced/wasm'
        },
        {
          text: 'Triggers',
          link: 'guide/advanced/triggers'
        }
      ],
    },
    {
      text: 'Appendix',
      link: '/guide/appendix/intro',
      children: [
        {
          text: 'Peer Configuration',
          link: '/guide/appendix/peer-configuration',
        },
        {
          text: 'Client Configuration',
          link: '/guide/appendix/client-configuration',
        },
        {
          text: 'Peer Management',
          link: '/guide/appendix/register-unregister',
        },
        {
          text: 'Genesis Block',
          link: '/guide/appendix/genesis',
        },
        {
          text: 'Keys',
          link: "/guide/appendix/keys"
        },
        {
          text: 'Running Iroha On Bare Metal',
          link: '/guide/appendix/running-iroha-on-bare-metal',
        },
      ],
    },
  ]
}

export default defineConfigWithTheme({
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

  markdown: {
    config(md) {
      md.use(footnote)
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    repo: 'hyperledger/iroha-2-docs',
    docsDir: 'src',

    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/': getGuideSidebar(),
    },
    nav: getNav(),

    algolia: {
      appId: 'V04UIXRXW5',
      apiKey: 'df91faea581b3b5145f676e262d5afc8',
      indexName: 'hyperledger'
    }
  },
})
