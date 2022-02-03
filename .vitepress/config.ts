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
          text: 'Bash guide',
          link: '/guide/bash',
        },
        {
          text: 'Python 3 guide',
          link: '/guide/python',
        },
        {
          text: 'Rust guide',
          link: '/guide/rust',
        },
        {
          text: 'Kotlin/Java guide',
          link: '/guide/kotlin-java',
        },
        {
          text: 'JavaScript guide',
          link: '/guide/javascript',
        },
        {
          text: 'Conclusions',
          link: '/guide/conclusions',
        },
      ],
    },
    {
      text: 'Appendix',
      link: '/guide/appendix',
    },
  ],
}

export default defineConfigWithTheme({
  srcDir: 'src',
  title: 'Iroha 2',
  description: 'TODO',
  vite: {
    plugins: [Windi({ config: path.resolve(__dirname, '../windi.config.ts') })],
  },
  themeConfig: {
    sidebar,
  },
})
