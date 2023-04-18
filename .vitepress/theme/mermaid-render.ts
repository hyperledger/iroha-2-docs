import mermaid from 'mermaid'

export async function renderSvg(id: string, text: string, options: {
  theme: 'light' | 'dark'
}): Promise<{ svg: string }> {
  mermaid.initialize({ startOnLoad: true, theme: options.theme })
  const { svg } = await mermaid.render(id, text)
  return { svg }
}
