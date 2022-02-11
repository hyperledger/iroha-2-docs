import { defineConfigWithTheme } from 'vitepress'
import Windi from 'vite-plugin-windicss'
import path from 'path'

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
  {
    text: 'GitHub',
    link: 'https://github.com/hyperledger/iroha/tree/iroha2',
  },
]

export default defineConfigWithTheme({
  srcDir: 'src',
  title: 'IROHA 2',
  description: 'TODO',
  base: process.env.PUBLIC_PATH ?? '',
  vite: {
    plugins: [Windi({ config: path.resolve(__dirname, '../windi.config.ts') })],
  },
  themeConfig: {
    sidebar,
    nav,
  },
})
