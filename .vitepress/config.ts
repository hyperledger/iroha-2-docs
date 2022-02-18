import { defineConfigWithTheme, UserConfig } from 'vitepress'
import Windi from 'vite-plugin-windicss'
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

const sidebar = {
  '/guide/': [
    {
      text: 'Getting started',
      children: [
        {
          text: 'Introduction',
          link: '/guide/introduction',
        },
        {
          text: 'Build and Install',
          link: '/guide/build-and-install',
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
          text: 'Appendix',
          link: '/guide/appendix',
        },
      ],
    },
  ],
}

const nav = [
  {
    text: 'Guide',
    link: '/guide/introduction',
    activeMatch: /^\/guide/,
  },
  {
    text: 'API',
    link: '/api/',
  },
]

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
  themeConfig: {
    logo: '/logo.svg',
    repo: 'hyperledger/iroha-2-docs',
    docsDir: 'src',

    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',

    sidebar,
    nav,
  },
})
