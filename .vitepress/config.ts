import { defineConfigWithTheme } from 'vitepress'
import Windi from 'vite-plugin-windicss'
import path from 'path'

export default defineConfigWithTheme({
    srcDir: 'src',
    title: 'Iroha 2',
    description: '*some description*',
    vite: {
        plugins: [Windi({ config: path.resolve(__dirname, '../windi.config.ts') })],
    },
})
