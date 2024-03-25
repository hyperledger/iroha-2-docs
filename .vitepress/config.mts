/// <reference types="vite/client" />

import { DefaultTheme, defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { resolve } from 'path'
import ViteSvgLoader from 'vite-svg-loader'
import ViteUnoCSS from 'unocss/vite'
import { mermaid } from './md-mermaid'
import { katex } from '@mdit/plugin-katex'

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      activeMatch: '^/$|^/guide/',
      items: [
        // { text: 'Get Started', link: '/guide/get-started/index' },
        // { text: 'Build and Install', link: '/guide/get-started/install' },
        // { text: 'Tutorials', link: '/guide/get-started/tutorials'},
        {
          text: 'Get Started',
          items: [
            { text: 'Build and Install', link: '/guide/get-started/install' },
            { text: 'SDK Tutorials', link: '/guide/get-started/tutorials' },
          ],
        },
        // every part of guides needs an intro
        { text: 'How Iroha Works', link: '/guide/blockchain/how-iroha-works' },
        { text: 'Security', link: '/guide/security/index' },
        { text: 'Configuration and Management', link: '/guide/configure/overview' },
        { text: 'Troubleshooting', link: '/guide/troubleshooting/overview' },
      ],
    },
    {
      text: 'Reference',
      link: '/reference/torii-endpoints',
      activeMatch: '^/reference/',
    },
  ]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'About',
      items: [
        {
          text: 'Glossary',
          link: '/reference/glossary.md',
        },
        {
          text: 'Naming Conventions',
          link: '/reference/naming.md',
        },
        {
          text: 'Compatibility Matrix',
          link: '/reference/compatibility-matrix',
        },
        {
          text: 'Foreign Function Interfaces',
          link: '/reference/ffi',
        },
      ],
    },
    {
      text: 'Reference',
      items: [
        {
          text: 'CLI',
          link: '/reference/cli',
        },
        {
          text: 'Torii Endpoints',
          link: '/reference/torii-endpoints',
        },
        {
          text: 'Data Model Schema',
          link: '/reference/data-model-schema',
        },
        {
          text: 'Instructions',
          link: '/reference/instructions',
        },
        {
          text: 'Queries',
          link: '/reference/queries',
        },
        {
          text: 'Permissions',
          link: '/reference/permissions',
        },
        {
          text: 'Genesis Block',
          link: '/reference/genesis',
        },
      ],
    },
    {
      text: 'Configuration',
      items: [
        {
          text: 'Overview',
          link: '/reference/config/',
        },
        {
          text: 'Parameters',
          items: [
            // TODO: consider re-ordering sections to a more intuitive format?
            {
              text: 'Base',
              link: '/reference/config/base-params',
            },
            {
              text: 'Genesis',
              link: '/reference/config/genesis-params',
            },
            {
              text: 'Network',
              link: '/reference/config/network-params',
            },
            {
              text: 'Torii',
              link: '/reference/config/torii-params',
            },
            {
              text: 'Sumeragi',
              link: '/reference/config/sumeragi-params',
            },
            {
              text: 'Kura',
              link: '/reference/config/kura-params',
            },
            {
              text: 'Logger',
              link: '/reference/config/logger-params',
            },
            {
              text: 'Queue',
              link: '/reference/config/queue-params',
            },
            {
              text: 'Snapshot',
              link: '/reference/config/snapshot-params',
            },
            {
              text: 'Telemetry',
              link: '/reference/config/telemetry-params',
            },
            {
              text: 'Chain Wide',
              link: '/reference/config/chain-wide-params',
            },
          ],
        },
        {
          text: 'Glossary',
          link: '/reference/config/glossary',
        },
        {
          text: 'Migration',
          link: '/reference/config/migration',
        },
      ],
    },
    {
      text: 'Client CLI',
      items: [
        {
          text: 'CLI',
        },
        {
          text: 'Configuration',
        },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Get Started',
      items: [
        {
          text: 'About Iroha',
          link: '/guide/introduction',
        },
        {
          text: 'Iroha 2 vs. Iroha 1',
          link: '/guide/iroha-2',
        },
        {
          text: 'Build and Install',
          collapsed: true,
          items: [
            {
              text: 'Install Iroha',
              link: '/guide/get-started/install',
            },
            {
              text: 'Build Iroha Client',
              link: '/guide/get-started/build',
            },
            {
              text: 'Quick Start with Docker',
              link: '/guide/get-started/quick-start',
            },
          ],
        },
        {
          text: 'Receive support',
          link: '/guide/support.md',
        },
      ],
    },
    {
      text: 'Security',
      collapsed: true,
      items: [
        {
          text: 'Overview',
          link: '/guide/security/',
        },
        {
          text: 'Security Principles',
          link: '/guide/security/security-principles.md',
        },
        {
          text: 'Operational Security',
          link: '/guide/security/operational-security.md',
        },
        {
          text: 'Password Security',
          link: '/guide/security/password-security.md',
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
          ],
        },
      ],
    },
    {
      text: 'SDK Tutorials',
      collapsed: true,
      items: [
        {
          text: 'Introduction',
          link: '/guide/get-started/tutorials',
        },
        /* a common lang-agnostic section will go here */
        {
          text: 'Language-specific Guides',
          items: [
            {
              text: 'Bash',
              link: '/guide/get-started/bash',
            },
            {
              text: 'Python 3',
              link: '/guide/get-started/python',
            },
            {
              text: 'Rust',
              link: '/guide/get-started/rust',
            },
            {
              text: 'Kotlin/Java',
              link: '/guide/get-started/kotlin-java',
            },
            {
              text: 'JavaScript',
              link: '/guide/get-started/javascript',
            },
          ],
        },
      ],
    },
    {
      text: 'Blockchain',
      items: [
        {
          text: 'How Iroha Works',
          link: '/guide/blockchain/how-iroha-works',
        },
        {
          text: 'Overview',
          collapsed: true,
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
          ],
        },
        {
          text: 'Entities',
          collapsed: true,
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
          collapsed: true,
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
          text: 'Overview',
          link: '/guide/configure/overview',
        },
        {
          text: 'Configure Iroha',
          collapsed: true,
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
          text: 'Keys for Network Deployment',
          link: '/guide/configure/keys-for-network-deployment.md',
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
      collapsed: true,
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
      collapsed: true,
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
      text: 'Reports',
      collapsed: true,
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
    plugins: [ViteUnoCSS('../uno.config.ts'), ViteSvgLoader()],
    envDir: resolve(__dirname, '../'),
  },
  lastUpdated: true,

  head: [
    // Based on: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    ['link', { rel: 'icon', href: BASE + 'favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: BASE + 'icon.svg', sizes: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: BASE + 'apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: BASE + 'manifest.webmanifest' }],
    // Google Analytics integration
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
    // KaTeX stylesheet
    ['link', { rel: 'stylesheet', href: 'https://esm.sh/katex@0.16.8/dist/katex.min.css' }],
  ],

  markdown: {
    async config(md) {
      md.use(footnote)
        .use(mermaid)
        // Note: Since vitepress@1.0.0-rc.14, it supports MathJax natively with `markdown.math = true`:
        //   https://github.com/vuejs/vitepress/pull/2977
        // Although KaTeX is more efficient, we might consider removing it in the future.
        .use(katex)
    },
  },

  themeConfig: {
    // logo: '/icon.svg',
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

    lastUpdated: {
      text: 'Last Updated',
    },

    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
      '/reference/': sidebarReference(),
    },

    search: {
      provider: 'local',
    },
  },
})
