import MarkdownIt from 'markdown-it'
import { type RuleBlock } from 'markdown-it/lib/parser_block'
import { type RenderRule } from 'markdown-it/lib/renderer'
import StateBlock from 'markdown-it/lib/rules_block/state_block'
import { RuleCore } from 'markdown-it/lib/parser_core'
import StateCore from 'markdown-it/lib/rules_core/state_core'

const GROUP_TYPE_OPEN = 'code-group__open'
const GROUP_TYPE_CLOSE = 'code-group__close'
const SLOT_TYPE_OPEN = 'code-group-slot__open'
const SLOT_TYPE_CLOSE = 'code-group-slot__close'
const NESTING_OPENING = 1
const NESTING_CLOSING = -1

interface GroupMeta {
  fenceBlocks: FenceBlockMeta[]
}

interface FenceBlockMeta {
  lang?: string
  title?: string
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

function findClosingLine(state: StateBlock, startLine: number, endLine: number): number {
  let i = startLine

  while (++i < endLine) {
    const { start, end } = getLineBoundaries(state, i)
    const content = state.src.slice(start, end)
    if (content === ':::') break
  }

  return i
}

function processFenceWithinCodeGroup(state: StateCore, idx: number): { codeGroupEndIdx: number } {
  const codeGroupOpenToken = state.tokens[idx]

  const fenceBlocks: FenceBlockMeta[] = []

  let i: number
  for (i = idx + 1; i < state.tokens.length; i++) {
    const token = state.tokens[i]
    if (token.type === 'fence') {
      const parsedInfo = parseFenceInfo(token.info)
      token.info = parsedInfo?.lang ?? ''

      const meta: SlotMeta = { idx: fenceBlocks.length }

      fenceBlocks.push({ ...parsedInfo })

      const tokenTemplateOpen = new state.Token(SLOT_TYPE_OPEN, 'template', NESTING_OPENING)
      tokenTemplateOpen.block = true
      tokenTemplateOpen.meta = meta

      const tokenTemplateClose = new state.Token(SLOT_TYPE_CLOSE, 'template', NESTING_CLOSING)
      tokenTemplateClose.block = true

      state.tokens.splice(i, 1, tokenTemplateOpen, token, tokenTemplateClose)
      i += 2
    } else if (token.type === GROUP_TYPE_CLOSE) break
  }

  const groupMeta: GroupMeta = {
    fenceBlocks,
  }
  codeGroupOpenToken.meta = groupMeta

  return { codeGroupEndIdx: i }
}

const FENCE_INFO_RE = /(\w+)\s*(?:\[(.*?)\])?/

function parseFenceInfo(str: string): { lang: string; title?: string } | null {
  const matched = str.match(FENCE_INFO_RE)
  if (matched) {
    const [, lang, title] = matched as [string, string, string?]
    return { lang, title }
  }
  return null
}

export const codeGroupPlugin: MarkdownIt.PluginSimple = (md) => {
  const parseContainer: RuleBlock = (state, startLine, endLine, silent) => {
    const { start, end } = getLineBoundaries(state, startLine)
    const markup = state.src.slice(start, end)

    if (isCodeGroupContainer(markup)) {
      const oldParentType = state.parentType,
        oldLineMax = state.lineMax

      state.parentType = 'code-group' as any

      const containerEndLine = findClosingLine(state, startLine, endLine)

      const tokenOpen = state.push(GROUP_TYPE_OPEN, '', NESTING_OPENING)
      tokenOpen.block = true
      tokenOpen.markup = markup

      state.md.block.tokenize(state, startLine + 1, containerEndLine)

      const tokenClose = state.push(GROUP_TYPE_CLOSE, '', NESTING_CLOSING)
      tokenClose.block = true
      tokenClose.markup = ':::'

      state.parentType = oldParentType
      state.lineMax = oldLineMax
      state.line = endLine + 1

      return true
    }

    return false
  }

  const parseSlots: RuleCore = (state) => {
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

  const renderContainer: RenderRule = (tokens, idx) => {
    const token = tokens[idx]
    if (token.nesting === NESTING_OPENING) {
      const { fenceBlocks } = token.meta as GroupMeta

      const langs = `{${fenceBlocks
        .flatMap((x, i) => (x.lang ? [[x.lang, i] as [string, number]] : []))
        .map(([lang, i]) => `${i}: '${lang}'`)
        .join(',')}}`

      const titleTemplates = fenceBlocks
        .flatMap((x, i) => (x.title ? [`<template #block-${i}-title>${x.title}</template>`] : []))
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
      return `</template>`
    }
  }

  md.block.ruler.before('fence', 'code-group-container', parseContainer)
  md.core.ruler.after('inline', 'code-group-slots', parseSlots)

  md.renderer.rules[GROUP_TYPE_OPEN] = md.renderer.rules[GROUP_TYPE_CLOSE] = renderContainer
  md.renderer.rules[SLOT_TYPE_OPEN] = md.renderer.rules[SLOT_TYPE_CLOSE] = renderSlot
}
