import { defineConfig } from 'windicss/helpers'
import path from 'path'

export default defineConfig({
  preflight: false,
  extract: {
    include: [path.join(__dirname, '.vitepress/theme/**/*.vue')],
  },
})
