/// <reference types="vite/client" />

import { defineConfig, DefaultTheme } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import ViteSvgLoader from 'vite-svg-loader'
import ViteUnoCSS from 'unocss/vite'
import { mermaid } from './md-mermaid'

function getNav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      link: '/',
      activeMatch: '^/$|^/guide/',
    },
    {
      text: 'Schema',
      link: '/data-model-schema/',
      activeMatch: '^/data-model-schema/',
    },
  ]
}

function getGuideSidebar(): DefaultTheme.SidebarItem[] {
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
      text: 'Security',
      link: '/guide/security/security.md',
      items: [
        {
          text: 'Security Principles',
          link: '/guide/security/security-principles.md',
        },
        {
          text: 'Operational Security',
          link: '/guide/security/operational-security.md',
        },
        {
          text: 'Public Key Cryptography',
          link: '/guide/security/public-key-cryptography.md',
          items: [
            {
              text: 'Generating Cryptographic Keys',
              link: '/guide/security/generating-cryptographic-keys.md',
            },
            {
              text: 'Storing Cryptographic Keys',
              link: '/guide/security/storing-cryptographic-keys.md',
            },
            {
              text: 'Keys for Deploying a Network',
              link: '/guide/security/keys-for-network-deployment.md',
            },
              ],
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
            {
              text: 'Metadata and Store assets',
              link: '/guide/configure/metadata-and-store-assets',
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
    {
      text: 'Reports',
      items: [
        {
          text: 'CSD/RTGS linkages via on-chain scripting',
          link: '/guide/reports/csd-rtgs',
        },
      ],
    },
  ]
}

const BASE = process.env.PUBLIC_PATH ?? '/'

export default defineConfig({
  base: BASE,
  srcDir: 'src',
  srcExclude: ['snippets/*.md'],
  title: 'Hyperledger Iroha 2 Tutorial',
  description:
    'Documentation for Hyperledger Iroha 2 offering step-by-step guides for SDKs and outlining the main differences between Iroha versions.',
  lang: 'en-US',
  vite: {
    plugins: [
      ViteUnoCSS(),
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
      ViteSvgLoader(),
    ],
    envDir: resolve(__dirname, '../'),
  },
  lastUpdated: true,

  head: [
    // Based on: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    ['link', { rel: 'icon', href: BASE + 'favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: BASE + 'icon.svg', sizes: 'image/svg+xml' }],
    ['link', { ref: 'apple-touch-icon', href: BASE + 'apple-touch-icon.png' }],
    // Google analytics integration
    ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-D6ETK9TN47' }],
    [
      'script',
      {},
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-D6ETK9TN47');
    `,
    ],
  ],

  markdown: {
    async config(md) {
      md.use(footnote).use(mermaid)
    },
    theme: 'github-dark-dimmed',
  },

  themeConfig: {
    logo: '/icon.svg',
    siteTitle: 'Iroha 2',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hyperledger/iroha-2-docs' },
      {
        icon: {
          /**
           * https://icones.js.org/collection/material-symbols?s=bug
           */
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-1.625 0-3.013-.8T6.8 18H4.975q-.425 0-.7-.288T4 17q0-.425.288-.713T5 16h1.1q-.075-.5-.088-1T6 14H4.975q-.425 0-.7-.288T4 13q0-.425.288-.713T5 12h1q0-.5.013-1t.087-1H4.975q-.425 0-.7-.288T4 9q0-.425.288-.713T5 8h1.8q.35-.575.788-1.075T8.6 6.05l-.925-.95q-.275-.3-.263-.713T7.7 3.7q.275-.275.7-.275t.7.275l1.45 1.45q.7-.225 1.425-.225t1.425.225l1.5-1.475q.3-.275.713-.262t.687.287q.275.275.275.7t-.275.7l-.95.95q.575.375 1.038.863T17.2 8h1.825q.425 0 .7.288T20 9q0 .425-.288.713T19 10h-1.1q.075.5.088 1T18 12h1.025q.425 0 .7.288T20 13q0 .425-.288.713T19 14h-1q0 .5-.013 1t-.087 1h1.125q.425 0 .7.288T20 17q0 .425-.288.713T19 18h-1.8q-.8 1.4-2.188 2.2T12 21Zm0-2q1.65 0 2.825-1.175T16 15v-4q0-1.65-1.175-2.825T12 7q-1.65 0-2.825 1.175T8 11v4q0 1.65 1.175 2.825T12 19Zm-1-3h2.025q.425 0 .7-.288T14 15q0-.425-.288-.713T13 14h-2.025q-.425 0-.7.288T10 15q0 .425.288.713T11 16Zm0-4h2.025q.425 0 .7-.288T14 11q0-.425-.288-.713T13 10h-2.025q-.425 0-.7.288T10 11q0 .425.288.713T11 12Zm1 1Z"/></svg>`,
        },
        link: 'https://github.com/hyperledger/iroha-2-docs/issues/new',
      },
    ],

    editLink: {
      pattern: 'https://github.com/hyperledger/iroha-2-docs/edit/main/src/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdatedText: 'Last Updated',

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/data-model-schema': [
        {
          text: 'Channel',
          items: ['stable', 'lts', 'dev'].map((channel) => ({
            link: `/data-model-schema/${channel}`,
            text: `iroha2-${channel}`,
          })),
        },
      ],
      '/': getGuideSidebar(),
    },
    nav: getNav(),

    search: {
      provider: 'local',
    },
  },
})
