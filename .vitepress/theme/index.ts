import ThemeDefault from 'vitepress/theme'
import CodeGroup from './components/CodeGroup.vue'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  enhanceApp({ app }) {
    app.component('CodeGroup', CodeGroup)
  },
}
