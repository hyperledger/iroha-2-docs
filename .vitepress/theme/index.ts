import ThemeDefault from 'vitepress/theme'
import Layout from './components/Layout.vue'

import 'uno.css'
import '@fontsource/jetbrains-mono'
import '@fontsource/source-serif-4/400.css'
import '@fontsource/source-serif-4/400-italic.css'
import '@fontsource/source-serif-4/600.css'
import '@fontsource/source-serif-4/600-italic.css'

import './style/index.scss'

export default {
  ...ThemeDefault,
  Layout,
}
