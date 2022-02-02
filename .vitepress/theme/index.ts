import ThemeDefault from 'vitepress/theme'
import { App } from 'vue'
import { CodeSection, CodeTabs } from './components/CodeTabs'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  enhanceApp({ app }: { app: App }) {
    app.component('CodeSection', CodeSection)
    app.component('CodeTabs', CodeTabs)
  },
}
