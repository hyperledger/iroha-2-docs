import ThemeDefault from 'vitepress/theme'
import SnippetTabs from './components/SnippetTabs.vue'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  enhanceApp({ app }) {
    app.component('SnippetTabs', SnippetTabs);
  }
}
