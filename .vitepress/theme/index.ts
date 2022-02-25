import ThemeDefault from 'vitepress/theme'
import Layout from './components/Layout.vue'

import 'virtual:windi.css'
import './style/index.scss'

// importing optimized "Inter" font from @vue/theme
import 'virtual:vue-theme-fonts.css'

export default {
  ...ThemeDefault,
  Layout,
}
