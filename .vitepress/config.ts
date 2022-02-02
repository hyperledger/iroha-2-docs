import { defineConfigWithTheme, Theme } from 'vitepress'
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
          text: '0. Build and Install',
          link: '/guide/0-build-and-install',
        },
        {
          text: 'Bash',
          children: [
            {
              text: '1. Client Setup',
              link: '/guide/bash/1-client-setup',
            },
            {
              text: '2. Configuring Iroha 2',
              link: '/guide/bash/2-configure-iroha',
            },
          ],
        },
      ],
    },
  ],
}

export default defineConfigWithTheme({
  srcDir: 'src',
  title: 'Iroha 2',
  description: 'TODO',
  vite: {
    plugins: [Windi()],
  },
  themeConfig: {
    sidebar,
  },
})
