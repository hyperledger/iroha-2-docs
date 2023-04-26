/// <reference types="vite/client" />

import ThemeDefault from 'vitepress/theme'
import { type EnhanceAppContext } from 'vitepress'
import LayoutCustom from './components/LayoutCustom.vue'
import MermaidRenderWrap from './components/MermaidRenderWrap.vue'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  Layout: LayoutCustom,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('Mermaid', MermaidRenderWrap)
  },
}
