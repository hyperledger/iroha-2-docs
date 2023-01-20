import { Component } from 'vue'

const icons = import.meta.glob('./icons/*.svg', { eager: true })

const ALIASES = {
  Bash: new Set(['shell', 'sh', 'shellscript', 'bash', 'zsh']),
  Python: new Set(['py', 'python']),
  JavaScript: new Set(['javascript', 'js']),
  TypeScript: new Set(['typescript', 'ts']),
  Rust: new Set(['rust', 'rs']),
  Java: new Set(['java']),
  Vue: new Set(['vue']),
  Json: new Set(['json']),
}

const ALIAS_TO_ICON = new Map<string, Component | undefined>(
  Object.entries(ALIASES).flatMap(([icon, aliases]) =>
    [...aliases].map((alias) => [alias, (icons[`./icons/${icon}.svg`] as undefined | { default: Component })?.default]),
  ),
)

export function tryFindIcon(lang: string): null | Component {
  return ALIAS_TO_ICON.get(lang) ?? null
}
