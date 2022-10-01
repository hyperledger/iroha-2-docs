'use strict'

import { readFileSync } from 'fs'
import { resolve, join } from 'path'
import { renderToHtml } from 'shiki'

/**
 * Load JSON or return an Error instance
 *
 * @param {string} jsonPath - a path to the JSON file
 * @returns {any} The deserialized file contents
 */
function loadJsonFile(jsonPath: string): any {
  // Start with an exception by default
  let result = new Error('No sources available')
  // Load a file
  try {
    // Load sources
    const exampleSourcesStr = readFileSync(resolve(jsonPath), 'utf8')
    // Parse the result
    if (exampleSourcesStr) {
      result = JSON.parse(exampleSourcesStr)
    }
  } catch (error) {
    result = error
  }
  // Return the sources or an Error instance
  return result
}

/**
 * Generates a Shiki HTML output without the wrapping tags.
 *
 * @param {string} code - the code to highlight
 * @param {string} highlightLang - highlight language
 * @param {any} highlighter - Shiki highlighter instance
 * @returns {any} The deserialized file contents
 */
const highlightCode = (code: string, highlightLang: string, highlighter: any): string => {
  const tokens = highlighter.codeToThemedTokens(code, highlightLang)
  const html: string = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor('github-light'),
    elements: {
      pre({ _, __, children }) {
        return `${children}`
      },
      code({ _, __, children }) {
        return `${children}`
      },
    },
  })
  return html
}

// Vue component tag to be used
const COMP_TAG = 'SnippetTabs'

// A custom error type used for
// snippet or snippet metadata access errors
class SnippetAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SnippetAccessError'
  }
}

// A level change marker for markdown-it
enum TokenNesting {
  Opening = -1,
  SelfClosing = 0,
  Closing = 1,
}

/**
 * Redefine the Token type from markdown-it to avoid importing CJS
 * https://markdown-it.github.io/markdown-it/#Token
 *
 * @typedef {object} Token
 */
type Token = {
  // Source map info. Format: [ line_begin, line_end ].
  map: number[]
  // Used in the renderer to calculate line breaks.
  // True for block-level tokens.
  // False for inline tokens.
  block: boolean
  // '*' or '_' for emphasis, fence string for fence, etc.
  markup: string
  // Info string for "fence" tokens
  info: string
  // Level change marker
  nesting: TokenNesting
}

/**
 * Redefine the StateBlock type from markdown-it that represents a parser state
 * to avoid importing CJS
 *
 * @typedef {object} StateBlock
 */
type StateBlock = {
  line: number
  push(arg0: string, arg1: string, arg2: number): Token
  skipSpaces(pos: number): number
  src: string
  bMarks: number[]
  eMarks: number[]
  tShift: number[]
  sCount: number[]
  lineMax: number
  parentType: string
  blkIndent: number
}

/**
 * Redefine a type that (vaguely) represents markdown-it
 *
 * @typedef {object} MarkdownIt
 */
type MarkdownIt = {
  block: any
  renderer: any
}

/**
 * A function that splits string by new lines
 * and trims each of those lines.
 *
 * @param {string} input - an input string
 * @returns {string[]} a list of trimmed lines
 */
function splitAndTrimLines(input: string): Array<string> {
  return input.split(/\r?\n/).map((item) => item.trim())
}

/**
 * A function that composes a new string out of file names
 * provided to it.
 *
 * Used by the "snippetLocRender" function to render
 * the contents of a Vue component slot.
 * This component will then display the snippets.
 *
 * @param {string[]} filenames - a list of file path strings
 * @param {string} snippetRoot - a root directory for the snippets
 * @returns {string} a string, composed of file contents
 */
function fileListToHighlightedStr(
  filenames: string[],
  snippetRoot: string,
  metaPath: string,
  highlighter: any,
): string {
  let result = ''
  const snippetMeta: { [x: string]: any } = loadJsonFile(metaPath)
  if (snippetMeta instanceof Error) {
    const mdMsg =
      `Unable to read a metadata file.\n` +
      `Filename: metadata.json".\n` +
      `Directory path: "${snippetRoot}".\n\n` +
      `Regenerate snippets if it doesn't exist, fix access rights otherwise.\n` +
      `To regenerate the snippets, run "npm run get_snippets" ` +
      `or "pnpm run get_snippets" command.\n` +
      `Read more in "Documenting Iroha" → "Code snippets" part of the tutorial.` +
      `\n`
    throw new SnippetAccessError(mdMsg)
  }
  for (let filenameId = 0; filenameId < filenames.length; filenameId++) {
    const lineFilename = filenames[filenameId].trim()
    const linePath = join(snippetRoot, lineFilename)
    const lineMeta = snippetMeta[lineFilename]
    try {
      const fileContent = readFileSync(linePath).toString()
      const highlightedCode = highlightCode(fileContent, lineMeta['lang'], highlighter)
      const tabHtml =
        `<pre class="tab_content" data-name="${lineMeta['name']}" ` +
        `data-lang="${lineMeta['lang']}">` +
        `<code>${highlightedCode}</code></pre>`
      result += tabHtml
    } catch (err) {
      const msg =
        `Unable to read a file.\n` +
        `Filename: "${lineFilename}".\n` +
        `Directory path: "${snippetRoot}".\n\n` +
        `Ensure it exists, its location is correct and its access rights allow to read it.\n` +
        `If you did not download the snippets, use the "npm run get_snippets" ` +
        `or "pnpm run get_snippets" command.\n` +
        `Read more in "Documenting Iroha" → "Code snippets" part of the tutorial.` +
        `\n`
      throw new SnippetAccessError(msg)
    }
  }
  return result
}

/**
 * A function that initializes a snippet group markdown-it plugin.
 */
export function snippets_plugin(md: MarkdownIt, options: Record<string, any>) {
  /**
   * A function that validates snippet parameters and allows it to be rendered.
   * If a path is incorrect, rendering won't happen.
   *
   * @param {string} params - a parameter string that points out a path to the snippets
   * @returns {bool} - whether the snippet directory exists or not
   */
  function validateDefault(params: string): boolean {
    return params.toLowerCase() == 'snippets'
  }

  /**
   * Render a section with a pre-defined wrapper tag
   *
   * @param {string} tokens - a list of markdown-it token instances
   */
  function snippetRender(tokens: Array<Token>, idx: number): string {
    if (tokens[idx].nesting === 1) {
      // Render an opening tag
      return `<${COMP_TAG}>\n`
    } else {
      // Render an closing tag
      return `</${COMP_TAG}>\n`
    }
  }

  /**
   * Render slots inside the SnippetTabs Vue component.
   *
   * Locates the internal path or an updated one,
   * outputs the contents of files inside.
   *
   * @param {Array<Token>} tokens - array of Markdown token instances
   * @param {number} idx
   * @returns {string} - render results
   */
  function snippetLocRender(tokens: Array<Token>, idx: number): string {
    const pathStr = options.snippet_root || join(options.snippet_root, tokens[idx - 1].info.trim())
    const snippetRoot: string = resolve(pathStr)
    const metaPath: string = join(snippetRoot, 'meta.json')
    const filenames: string[] = splitAndTrimLines(tokens[idx].info.trim())
    return `${fileListToHighlightedStr(filenames, snippetRoot, metaPath, options.highlighter)}\n`
  }

  options = options || {}

  const min_markers = 2,
    marker_str = ':',
    marker_char: number = marker_str.charCodeAt(0),
    marker_len: number = marker_str.length,
    validate: Function = options.validate || validateDefault,
    render: Function = snippetRender

  if (!options.hasOwnProperty('snippet_root') || options.snippet_root.constructor.name !== 'String') {
    const errTxt = 'Incorrect configuration. ' + 'A correct value for snippet_root is required for snippet_tabs plugin.'
    throw new Error(errTxt)
  }

  function snippet_container(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
    let pos: number,
      nextLine: number,
      marker_count: number,
      markup: string,
      params: string,
      token: Token,
      old_parent: string,
      old_line_max: number,
      auto_closed = false,
      start: number = state.bMarks[startLine] + state.tShift[startLine],
      max: number = state.eMarks[startLine]

    // Check out the first character quickly
    // to filter out most of non-containers
    if (marker_char !== state.src.charCodeAt(start)) {
      return false
    }

    // Continue checking of the marker string
    for (pos = start + 1; pos <= max; pos++) {
      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
        break
      }
    }

    marker_count = Math.floor((pos - start) / marker_len)
    if (marker_count < min_markers) {
      return false
    }
    pos -= (pos - start) % marker_len

    markup = state.src.slice(start, pos)
    params = state.src.slice(pos, max)
    // Ignore a string that does not get validated
    if (!validate(params, markup)) {
      return false
    }

    // Since start is found, we can report success here in validation mode
    if (silent) return true

    // Search for the end of the block
    nextLine = startLine

    for (;;) {
      nextLine++
      if (nextLine >= endLine) {
        // Non-closed block should be autoclosed by end of document.
        // Also, block seems to be
        // automatically closed by the end of a parent one.
        break
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]

      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break
      }

      if (marker_char !== state.src.charCodeAt(start)) {
        continue
      }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue
      }

      for (pos = start + 1; pos <= max; pos++) {
        if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
          break
        }
      }

      // closing code fence must be at least as long as the opening one
      if (Math.floor((pos - start) / marker_len) < marker_count) {
        continue
      }

      // make sure tail has spaces only
      pos -= (pos - start) % marker_len
      pos = state.skipSpaces(pos)

      if (pos < max) {
        continue
      }

      // found!
      auto_closed = true
      break
    }

    old_parent = state.parentType
    old_line_max = state.lineMax
    state.parentType = 'snippets'

    // Prevent the lazy continuations from ever going past an end marker
    state.lineMax = nextLine

    token = state.push('snippets_open', 'div', 1)
    token.markup = markup
    token.block = true
    token.info = params
    token.map = [startLine, nextLine]

    token = state.push('snippet_locations', 'div', 1)
    token.markup = markup
    token.block = true
    token.info = state.src.slice(state.bMarks[startLine + 1], state.bMarks[nextLine])
    token.map = [startLine, nextLine]

    token = state.push('snippets_close', 'div', -1)
    token.markup = state.src.slice(start, pos)
    token.block = true

    state.parentType = old_parent
    state.lineMax = old_line_max
    state.line = nextLine + (auto_closed ? 1 : 0)

    return true
  }

  md.block.ruler.before('fence', 'snippets', snippet_container, {})
  md.renderer.rules['snippets_open'] = render
  md.renderer.rules['snippets_close'] = render
  md.renderer.rules['snippet_locations'] = snippetLocRender
}
