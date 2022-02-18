import ThemeDefault from 'vitepress/theme'
import Layout from './components/Layout.vue'
// import Home from './components/Home.vue'

import 'virtual:windi.css'
import './style/index.scss'
// import { App } from 'vue'

export default {
  ...ThemeDefault,
  Layout,
//   enhanceApp({ app }: { app: App }) {
//     app.component('Home', Home)
//   },
// }
