/// <reference types="vite/client" />

import ThemeDefault from 'vitepress/theme'
import LayoutCustom from './components/LayoutCustom.vue'

import 'virtual:windi.css'
import './style/index.scss'

export default {
  ...ThemeDefault,
  Layout: LayoutCustom,
}
