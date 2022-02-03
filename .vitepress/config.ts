import { defineConfigWithTheme } from 'vitepress'
import Windi from 'vite-plugin-windicss'
import path from 'path'

function langSidebarLinks(langDirectory: string) {
  const link = (step: string) => `/guide/${langDirectory}/${step}`

  return [
    {
      text: '1. Client Setup',
      link: link('1-client-setup'),
    },
    {
      text: '2. Configuring Iroha 2',
      link: link('2-configure-iroha'),
    },
    {
      text: '3. Registering a Domain',
      link: link('3-register-domain'),
    },
    {
      text: '4. Registering an Account',
      link: link('4-register-account'),
    },
    {
      text: '5. Register and mint assets',
      link: link('5-register-and-mint-assets'),
    },
    {
      text: '6. Visualizing outputs',
      link: link('6-output'),
    },
  ]
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
          text: '0. Build and Install',
          link: '/guide/0-build-and-install',
        },
      ],
    },
    {
      text: 'Bash',
      children: langSidebarLinks('bash'),
    },
    {
      text: 'Python 3',
      children: langSidebarLinks('python'),
    },
    {
      text: 'Rust',
      children: langSidebarLinks('rust'),
    },
    {
      text: 'Kotlin/Java',
      children: langSidebarLinks('kotlin-java'),
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
