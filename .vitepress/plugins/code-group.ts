import type MarkdownIt from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block'
import type StateBlock from 'markdown-it/lib/rules_block/state_block'
import type { RuleCore } from 'markdown-it/lib/parser_core'
import type StateCore from 'markdown-it/lib/rules_core/state_core'

function makeOpenClose<S extends string>(
  s: S,
): {
  [K in 'OPEN' | 'CLOSE']: `${S}__${Lowercase<K>}`
} {
  return { OPEN: `${s}__open`, CLOSE: `${s}__close` }
}

const TOKEN_TYPES = {
  CONTAINER: makeOpenClose('code-group'),
  BLOCK: makeOpenClose('code-group__block'),
  BLOCK_TITLE: 'code-group__block-title',
}

const MARKER_CONTAINER_OPEN = ':::code-group'
const MARKER_CONTAINER_CLOSE = ':::'

enum Nesting {
  Opening = 1,
  Closing = -1,
  SelfClosing = 0,
}

const EnvWithinGroup = Symbol('Within code group')

interface ContainerMeta {
  fenceBlocks: ContainerMetaFenceBlock[]
}

interface ContainerMetaFenceBlock {
  lang: string | null
}

interface BlockMeta {
  idx: number
}

type BlockTitleMeta = BlockMeta

function getLineOffsets(state: StateBlock, line: number): { start: number; end: number } {
  const start = state.bMarks[line] + state.tShift[line]
  const end = state.eMarks[line]
  return { start, end }
}

function findCodeGroupClosingLine(state: StateBlock, startLine: number, endLine: number): number {
  let i = startLine

  while (++i < endLine) {
    const { start, end } = getLineOffsets(state, i)
    const content = state.src.slice(start, end)
    if (content === MARKER_CONTAINER_CLOSE) break
  }

  return i
}

function findIndexAfter<T>(items: T[], start: number, fn: (item: T) => boolean): null | { idx: number } {
  for (let i = start; i < items.length; i++) {
    if (fn(items[i])) return { idx: i }
  }
  return null
}

/**
 * - Wraps each fence into {@link TOKEN_TYPES.BLOCK} block and associates metadata to it
 * - Associates metadata for each found {@link TOKEN_TYPES.BLOCK_TITLE}
 */
function postprocessCodeGroupChildren(state: StateCore, idx: number): { codeGroupEndIdx: number } {
  const codeGroupOpenToken = state.tokens[idx]
  const fenceBlocks: ContainerMetaFenceBlock[] = []

  let i: number
  for (i = idx + 1; i < state.tokens.length; i++) {
    const token = state.tokens[i]
    if (token.type === 'fence') {
      const parsedInfo = parseFenceInfo(token.info)
      const meta: BlockMeta = { idx: fenceBlocks.length }

      fenceBlocks.push({ lang: parsedInfo.lang })

      const tokenTemplateOpen = new state.Token(TOKEN_TYPES.BLOCK.OPEN, 'template', Nesting.Opening)
      tokenTemplateOpen.block = true
      tokenTemplateOpen.meta = meta

      const tokenTemplateClose = new state.Token(TOKEN_TYPES.BLOCK.CLOSE, 'template', Nesting.Closing)
      tokenTemplateClose.block = true

      state.tokens.splice(i, 1, tokenTemplateOpen, token, tokenTemplateClose)
      i += 2
    } else if (token.type === TOKEN_TYPES.BLOCK_TITLE) {
      const blockIdx = fenceBlocks.length
      const meta: BlockTitleMeta = { idx: blockIdx }
      token.meta = meta
    } else if (token.type === TOKEN_TYPES.CONTAINER.CLOSE) break
  }

  const groupMeta: ContainerMeta = {
    fenceBlocks,
  }
  codeGroupOpenToken.meta = groupMeta

  return { codeGroupEndIdx: i }
}

function parseFenceInfo(str: string): { lang: string } {
  const match = str.match(/^(\w+)/)
  if (match) {
    const [, lang] = match
    return { lang }
  }
  return { lang: str.trim() }
}

/**
 * Usage example:
 *
 * ````md
 * :::code-group
 *
 * ```ts
 * const foo = 'bar'
 * ```
 *
 * ### Custom title (any heading level)
 *
 * ```
 * hello world
 * ```
 *
 * <<<@/snippets/lorem.py
 *
 * :::
 * ````
 */
export const codeGroupPlugin: MarkdownIt.PluginSimple = (md) => {
  const ruleBlockContainer: RuleBlock = (state, startLine, endLine) => {
    const { start, end } = getLineOffsets(state, startLine)
    const markup = state.src.slice(start, end)

    if (markup === MARKER_CONTAINER_OPEN) {
      const oldParentType = state.parentType,
        oldLineMax = state.lineMax

      state.parentType = 'code-group' as StateBlock.ParentType

      const containerEndLine = findCodeGroupClosingLine(state, startLine, endLine)

      const tokenOpen = state.push(TOKEN_TYPES.CONTAINER.OPEN, '', Nesting.Opening)
      tokenOpen.block = true
      tokenOpen.markup = markup
      tokenOpen.map = [startLine, containerEndLine]

      state.env[EnvWithinGroup] = true
      state.md.block.tokenize(state, startLine + 1, containerEndLine)
      delete state.env[EnvWithinGroup]

      const tokenClose = state.push(TOKEN_TYPES.CONTAINER.CLOSE, '', Nesting.Closing)
      tokenClose.block = true
      tokenClose.markup = MARKER_CONTAINER_CLOSE

      state.parentType = oldParentType
      state.lineMax = oldLineMax
      state.line = containerEndLine + 1

      return true
    }

    return false
  }

  /**
   * Transforms headings within a code group into {@link TOKEN_TYPES.BLOCK_TITLE} without metadata
   */
  const ruleBlockContainerHeadings: RuleBlock = (state, startLine) => {
    if (state.env[EnvWithinGroup]) {
      const { start, end } = getLineOffsets(state, startLine)
      const content = state.src.slice(start, end)
      const headingMatch = content.match(/^(#{1,7})\s+(.+)$/)
      if (headingMatch) {
        const [, markup, headingRawContent] = headingMatch

        state.line = startLine + 1

        const tokenOpen = state.push(TOKEN_TYPES.BLOCK_TITLE, 'template', Nesting.SelfClosing)
        tokenOpen.markup = markup
        tokenOpen.map = [startLine, state.line]
        tokenOpen.content = headingRawContent

        return true
      }
    }

    return false
  }

  const ruleCodeGroupPostprocess: RuleCore = (state) => {
    for (let i = 0; i < state.tokens.length; i++) {
      const opening = findIndexAfter(state.tokens, i, (x) => x.type === TOKEN_TYPES.CONTAINER.OPEN)
      if (opening) {
        ({ codeGroupEndIdx: i } = postprocessCodeGroupChildren(state, opening.idx))
      } else break
    }
  }

  md.block.ruler.before('fence', 'code-group-container', ruleBlockContainer)
  md.block.ruler.before('heading', 'code-group-inner-headings', ruleBlockContainerHeadings)
  md.core.ruler.after('inline', 'code-group-postprocess', ruleCodeGroupPostprocess)

  md.renderer.rules[TOKEN_TYPES.CONTAINER.OPEN] = md.renderer.rules[TOKEN_TYPES.CONTAINER.CLOSE] = (tokens, idx) => {
    const token = tokens[idx]
    if (token.nesting === Nesting.Opening) {
      const { fenceBlocks } = token.meta as ContainerMeta

      const langs = `{${fenceBlocks
        .flatMap((x, i) => (x.lang ? [[x.lang, i] as [string, number]] : []))
        .map(([lang, i]) => `${i}: '${lang}'`)
        .join(',')}}`

      return `<CodeGroup :blocks="${fenceBlocks.length}" :langs="${langs}">\n`
    } else {
      return `</CodeGroup>`
    }
  }

  md.renderer.rules[TOKEN_TYPES.BLOCK.OPEN] = md.renderer.rules[TOKEN_TYPES.BLOCK.CLOSE] = (tokens, idx) => {
    const token = tokens[idx]
    if (token.nesting === Nesting.Opening) {
      const { idx } = token.meta as BlockMeta
      return `<template #block-${idx}>\n`
    } else {
      return `</template>\n`
    }
  }

  md.renderer.rules[TOKEN_TYPES.BLOCK_TITLE] = (tokens, idx) => {
    const token = tokens[idx]
    const { idx: blockIdx } = token.meta as BlockTitleMeta
    return `<template #block-${blockIdx}-title>${token.content}</template>\n`
  }
}
