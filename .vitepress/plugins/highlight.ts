import { getHighlighter } from 'shiki'

// const htmlEscapes: Record<string, string> = {
//   '&': '&amp;',
//   '<': '&lt;',
//   '>': '&gt;',
//   '"': '&quot;',
//   "'": '&#39;',
// }

// function escapeHtml(html: string) {
//   return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr])
// }

const THEME_DARK = 'github-dark-dimmed'
// const THEME_LIGHT = 'github-light'

export default async () => {
  const highlighter = await getHighlighter({
    themes: [THEME_DARK],
  })

  return (code: string, lang: string) => {
    // if (!lang || lang === 'text') return `<pre v-pre class="shiki"><code>${escapeHtml(code)}</code></pre>`

    // const dark = highlighter
    //   .codeToHtml(code, { lang, theme: THEME_DARK })
    //   .replace('<pre class="shiki"', '<pre v-pre class="shiki shiki-dark"')

    const light = highlighter
      .codeToHtml(code, { lang, theme: THEME_DARK })
      .replace('<pre class="shiki"', '<pre v-pre class="shiki"')

    return light
  }
}
