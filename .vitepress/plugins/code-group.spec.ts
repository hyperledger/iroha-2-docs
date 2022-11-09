import { test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'
import { codeGroupPlugin } from './code-group'

function mdFactory() {
  const md = new MarkdownIt()
  md.use(codeGroupPlugin)
  return md
}

test('single tab without title', () => {
  const result = mdFactory().render(`
# Hello

:::code-group

\`\`\`ts
console.log()
\`\`\`

:::`)

  expect(result).toMatchInlineSnapshot(`
    "<h1>Hello</h1>
    <CodeGroup :blocks=\\"1\\" :langs=\\"{0: 'ts'}\\">

    <template #block-0>
    <pre><code class=\\"language-ts\\">console.log()
    </code></pre>
    </template>
    </CodeGroup>"
  `)
})

test('multiple tabs with titles and non-fence slots', () => {
  const result = mdFactory().render(`
# Hello

:::code-group

\`\`\`
.-.
\`\`\`

\`\`\`rs [My Title]
struct New;
\`\`\`


:::`)

  expect(result).toMatchInlineSnapshot(`
    "<h1>Hello</h1>
    <CodeGroup :blocks=\\"2\\" :langs=\\"{1: 'rs'}\\">
    <template #block-1-title>My Title</template>
    <template #block-0>
    <pre><code>.-.
    </code></pre>
    </template>
    <template #block-1>
    <pre><code class=\\"language-rs\\">struct New;
    </code></pre>
    </template>
    </CodeGroup>"
  `)
})
