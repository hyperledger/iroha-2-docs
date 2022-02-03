import { defineConfig } from 'windicss/helpers'
import path from 'path'

const resolveToRoot = (...paths: string[]): string => path.resolve(__dirname, ...paths)

export default defineConfig({
  preflight: false,
  extract: {
    include: ['.vitepress/theme/**/*.vue', 'src/**/*.md'].map((x) => resolveToRoot(x)),
    exclude: ['node_modules', '.git'].map((x) => resolveToRoot(x)),
  },
})
