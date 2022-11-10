import type MarkdownIt from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block'
import type { RenderRule } from 'markdown-it/lib/renderer'
import type StateBlock from 'markdown-it/lib/rules_block/state_block'
import type { RuleCore } from 'markdown-it/lib/parser_core'
import type StateCore from 'markdown-it/lib/rules_core/state_core'
import type Token from 'markdown-it/lib/token'
import invariant from 'tiny-invariant'

const GROUP_TYPE_OPEN = 'code-group__open'
const GROUP_TYPE_CLOSE = 'code-group__close'
const SLOT_TYPE_OPEN = 'code-group-slot__open'
const SLOT_TYPE_CLOSE = 'code-group-slot__close'
const HEADING_TYPE_OPEN = 'code-group__heading-open'
const HEADING_TYPE_CLOSE = 'code-group__heading-close'
const NESTING_OPENING = 1
const NESTING_CLOSING = -1

const EnvWithinGroup = Symbol('Within code group')

interface GroupMeta {
  fenceBlocks: FenceBlockMeta[]
}

interface FenceBlockMeta {
  lang?: string
  title?: Token[] | null
}

interface SlotMeta {
  idx: number
}

function getLineBoundaries(state: StateBlock, line: number): { start: number; end: number } {
  const start = state.bMarks[line] + state.tShift[line]
  const end = state.eMarks[line]
  return { start, end }
}

function isCodeGroupContainer(str: string): boolean {
  return str === ':::code-group'
}

function findCodeGroupClosingLine(state: StateBlock, startLine: number, endLine: number): number {
  let i = startLine

  while (++i < endLine) {
    const { start, end } = getLineBoundaries(state, i)
    const content = state.src.slice(start, end)
    if (content === ':::') break
  }

  return i
}

function findIndexAfter<T>(items: T[], start: number, fn: (item: T) => boolean): null | { idx: number } {
  for (let i = start; i < items.length; i++) {
    if (fn(items[i])) return { idx: i }
  }
  return null
}

function processFenceWithinCodeGroup(state: StateCore, idx: number): { codeGroupEndIdx: number } {
  const codeGroupOpenToken = state.tokens[idx]

  const fenceBlocks: FenceBlockMeta[] = []

  let i: number
  let lastHeading: null | Token[] = null

  for (i = idx + 1; i < state.tokens.length; i++) {
    const token = state.tokens[i]
    if (token.type === 'fence') {
      const parsedInfo = parseFenceInfo(token.info)
      token.info = parsedInfo?.lang ?? ''

      const meta: SlotMeta = { idx: fenceBlocks.length }

      fenceBlocks.push({ lang: parsedInfo.lang, title: lastHeading })
      lastHeading = null

      const tokenTemplateOpen = new state.Token(SLOT_TYPE_OPEN, 'template', NESTING_OPENING)
      tokenTemplateOpen.block = true
      tokenTemplateOpen.meta = meta

      const tokenTemplateClose = new state.Token(SLOT_TYPE_CLOSE, 'template', NESTING_CLOSING)
      tokenTemplateClose.block = true

      state.tokens.splice(i, 1, tokenTemplateOpen, token, tokenTemplateClose)
      i += 2
    } else if (token.type === HEADING_TYPE_OPEN) {
      const end = findIndexAfter(state.tokens, i, (x) => x.type === HEADING_TYPE_CLOSE)
      invariant(end)
      const headingTokens = state.tokens.splice(i, end.idx - i + 1)
      const children = headingTokens.slice(1, -1)
      lastHeading = children
      i -= 1
    } else if (token.type === GROUP_TYPE_CLOSE) break
  }

  const groupMeta: GroupMeta = {
    fenceBlocks,
  }
  codeGroupOpenToken.meta = groupMeta

  return { codeGroupEndIdx: i }
}

function parseFenceInfo(str: string): { lang: string } {
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
    const { start, end } = getLineBoundaries(state, startLine)
    const markup = state.src.slice(start, end)

    if (isCodeGroupContainer(markup)) {
      const oldParentType = state.parentType,
        oldLineMax = state.lineMax

      state.parentType = 'code-group' as any

      const containerEndLine = findCodeGroupClosingLine(state, startLine, endLine)

      const tokenOpen = state.push(GROUP_TYPE_OPEN, '', NESTING_OPENING)
      tokenOpen.block = true
      tokenOpen.markup = markup
      tokenOpen.map = [startLine, containerEndLine]

      state.env[EnvWithinGroup] = true
      state.md.block.tokenize(state, startLine + 1, containerEndLine)
      delete state.env[EnvWithinGroup]

      const tokenClose = state.push(GROUP_TYPE_CLOSE, '', NESTING_CLOSING)
      tokenClose.block = true
      tokenClose.markup = ':::'

      state.parentType = oldParentType
      state.lineMax = oldLineMax
      state.line = containerEndLine + 1

      return true
    }

    return false
  }

  const ruleBlockContainerHeadings: RuleBlock = (state, startLine) => {
    if (state.env[EnvWithinGroup]) {
      const { start, end } = getLineBoundaries(state, startLine)
      const content = state.src.slice(start, end)
      const headingMatch = content.match(/^(#{1,7})\s+(.+)$/)
      if (headingMatch) {
        const [, markup, headingRawContent] = headingMatch

        state.line = startLine + 1

        const tokenOpen = state.push(HEADING_TYPE_OPEN, '', NESTING_OPENING)
        tokenOpen.markup = markup
        tokenOpen.map = [startLine, state.line]

        const tokenInline = state.push('inline', '', 0)
        tokenInline.content = headingRawContent
        tokenInline.map = [startLine, state.line]
        tokenInline.children = []

        const tokenClose = state.push(HEADING_TYPE_CLOSE, '', NESTING_CLOSING)
        tokenClose.markup = markup

        return true
      }
    }

    return false
  }

  const ruleBlockSlots: RuleCore = (state) => {
    const findCodeGroupOpening = (start: number) => {
      for (let i = start; i < state.tokens.length; i++) {
        if (state.tokens[i].type === GROUP_TYPE_OPEN) return i
      }
      return -1
    }

    for (let i = 0; i < state.tokens.length; i++) {
      const opening = findCodeGroupOpening(i)
      if (opening >= 0) {
        const { codeGroupEndIdx } = processFenceWithinCodeGroup(state, opening)
        i = codeGroupEndIdx
      } else break
    }
  }

  const renderContainer: RenderRule = (tokens, idx, opts, env, self) => {
    const token = tokens[idx]
    if (token.nesting === NESTING_OPENING) {
      const { fenceBlocks } = token.meta as GroupMeta

      const langs = `{${fenceBlocks
        .flatMap((x, i) => (x.lang ? [[x.lang, i] as [string, number]] : []))
        .map(([lang, i]) => `${i}: '${lang}'`)
        .join(',')}}`

      const titleTemplates = fenceBlocks
        .flatMap((x, i) => {
          if (x.title) {
            const rendered = self.render(x.title, opts, env)
            return `<template #block-${i}-title>${rendered}</template>`
          }
          return []
        })
        .join('\n')

      return `<CodeGroup :blocks="${fenceBlocks.length}" :langs="${langs}">\n${titleTemplates}\n`
    } else {
      return `</CodeGroup>`
    }
  }

  const renderSlot: RenderRule = (tokens, idx) => {
    const token = tokens[idx]
    if (token.nesting === NESTING_OPENING) {
      const { idx } = token.meta as SlotMeta
      return `<template #block-${idx}>\n`
    } else {
      return `</template>\n`
    }
  }

  md.block.ruler.before('fence', 'code-group-container', ruleBlockContainer)
  md.block.ruler.before('heading', 'code-group-inner-headings', ruleBlockContainerHeadings)
  md.core.ruler.after('inline', 'code-group-slots', ruleBlockSlots)

  md.renderer.rules[GROUP_TYPE_OPEN] = md.renderer.rules[GROUP_TYPE_CLOSE] = renderContainer
  md.renderer.rules[SLOT_TYPE_OPEN] = md.renderer.rules[SLOT_TYPE_CLOSE] = renderSlot
}
