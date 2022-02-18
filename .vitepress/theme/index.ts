import ThemeDefault from 'vitepress/theme'
import Layout from './components/Layout.vue'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  Layout,
}
