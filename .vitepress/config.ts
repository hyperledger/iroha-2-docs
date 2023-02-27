/// <reference types="vite/client" />

import { defineConfig, DefaultTheme } from 'vitepress'
import Windi from 'vite-plugin-windicss'
import footnote from 'markdown-it-footnote'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

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
          text: 'How Iroha works',
          link: '/',
        },
        {
          text: 'Iroha 2 vs. Iroha 1',
          link: '/guide/iroha-2',
        },
        {
          text: 'Build and Install',
          items: [
            {
              text: 'Quick Start with Docker',
              link: '/guide/quick-start',
            },
            {
              text: 'Install Iroha',
              link: '/guide/install',
            },
            {
              text: 'Build Iroha Client',
              link: '/guide/build',
            },
          ],
        },
        {
          text: 'Receive support',
          link: '/guide/support.md',
        },
        {
          text: 'Glossary',
          link: '/guide/glossary.md',
        },
      ],
    },
    {
      text: 'Tutorial',
      items: [
        {
          text: 'Introduction',
          link: '/guide/intro',
        },
        /* a common lang-agnostic section will go here */
        {
          text: 'Language-specific Guides',
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
      ],
    },
    {
      text: 'Blockchain',
      items: [
        {
          text: 'Overview',
          items: [
            {
              text: 'Transactions',
              link: '/guide/blockchain/transactions',
            },
            {
              text: 'Consensus',
              link: '/guide/blockchain/consensus',
            },
            {
              text: 'Data Model',
              link: '/guide/blockchain/data-model',
            },
            {
              text: 'Naming Conventions',
              link: '/guide/blockchain/naming.md',
            },
          ],
        },
        {
          text: 'Entities',
          items: [
            {
              text: 'Assets',
              link: '/guide/blockchain/assets',
            },
            /*
            {
              text: 'Accounts',
              link: '/guide/blockchain/accounts',
            },
            {
              text: 'Domains',
              link: '/guide/blockchain/domains',
            },
            */
            {
              text: 'Metadata',
              link: '/guide/blockchain/metadata',
            },
            {
              text: 'Events',
              link: '/guide/blockchain/events',
            },
            {
              text: 'Filters',
              link: '/guide/blockchain/filters',
            },
            {
              text: 'Triggers',
              link: '/guide/blockchain/triggers',
            },
            {
              text: 'Queries',
              link: '/guide/blockchain/queries',
            },
            {
              text: 'Permissions',
              link: '/guide/blockchain/permissions',
            },
            {
              text: 'World',
              link: '/guide/blockchain/world',
            },
          ],
        },
        {
          text: 'Operations',
          items: [
            {
              text: 'Instructions',
              link: '/guide/blockchain/instructions',
            },
            {
              text: 'Expressions',
              link: '/guide/blockchain/expressions',
            },
            {
              text: 'Web Assembly',
              link: '/guide/blockchain/wasm',
            },
          ],
        },
      ],
    },
    {
      text: 'Configuration and Management',
      items: [
        {
          text: 'Configure Iroha',
          items: [
            {
              text: 'Configuration Types',
              link: '/guide/configure/configuration-types',
            },
            {
              text: 'Samples',
              link: '/guide/configure/sample-configuration',
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
          ],
        },
        {
          text: 'Public Key Cryptography',
          link: '/guide/configure/keys',
        },
        {
          text: 'Peer Management',
          link: '/guide/configure/peer-management',
        },
        {
          text: 'Public and Private Blockchains',
          link: '/guide/configure/modes',
        },
      ],
    },
    {
      text: 'Troubleshooting',
      items: [
        {
          text: 'Overview',
          link: '/guide/troubleshooting/overview',
        },
        {
          text: 'Installation',
          link: '/guide/troubleshooting/installation-issues',
        },
        {
          text: 'Configuration',
          link: '/guide/troubleshooting/configuration-issues',
        },
        {
          text: 'Deployment',
          link: '/guide/troubleshooting/deployment-issues',
        },
        {
          text: 'Integration',
          link: '/guide/troubleshooting/integration-issues',
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
        {
          text: 'Hot Reload Iroha',
          link: '/guide/advanced/hot-reload',
        },
        {
          text: 'Monitor Iroha Performance',
          link: '/guide/advanced/metrics',
        },
      ],
    },
    {
      text: 'API',
      items: [
        {
          text: 'Specification',
          link: '/api/index.md',
        },
        {
          text: 'Foreign Function Interfaces',
          link: '/api/ffi',
        },
      ],
    },
    {
      text: 'Documenting Iroha',
      items: [
        {
          text: 'Code Snippets',
          link: '/documenting/snippets',
        },
      ],
    },
  ]
}

const BASE = process.env.PUBLIC_PATH ?? '/'

export default defineConfig({
  base: BASE,
  srcDir: 'src',
  title: 'Hyperledger Iroha 2 Tutorial',
  description:
    'Documentation for Hyperledger Iroha 2 offering step-by-step guides for SDKs and outlining the main differences between Iroha versions.',
  lang: 'en-US',
  vite: {
    plugins: [
      Windi({ config: resolve(__dirname, '../windi.config.ts') }),
      VitePWA({
        // Based on: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
        manifest: {
          name: 'Hyperledger Iroha 2 Tutorial',
          icons: [
            {
              src: BASE + 'icon-192.png',
              type: 'image/png',
              sizes: '192x192',
            },
            {
              src: BASE + 'icon-512.png',
              type: 'image/png',
              sizes: '512x512',
            },
          ],
        },
        strategies: 'injectManifest',
        injectRegister: false,
      }),
      svgLoader(),
    ],
  },
  lastUpdated: true,

  head: [
    // Based on: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    ['link', { rel: 'icon', href: BASE + 'favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: BASE + 'icon.svg', sizes: 'image/svg+xml' }],
    ['link', { ref: 'apple-touch-icon', href: BASE + 'apple-touch-icon.png' }],
  ],

  markdown: {
    async config(md) {
      md.use(footnote)
    },
    theme: 'github-dark-dimmed',
  },

  themeConfig: {
    logo: '/icon.svg',
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
