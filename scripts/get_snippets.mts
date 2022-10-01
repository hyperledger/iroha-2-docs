/*
 * Snippet downloader version utilizing a monad-like pattern.
 */

import ora from 'ora'
import { join } from 'path'
import { resolve } from 'path'
import { ExampleParser } from 'dst-parser'
import { SourceDefinition, IndividualSnippet, SnippetProcessingState } from './types.mjs'
import { __dirname, SNIPPET_SRC_DIR, SOURCES } from './constants.mjs'
import { writeStrToFile, ensureDirExists } from './file_utils.mjs'
import { validateSources, collectPage, getSnippetFilename } from './util.mjs'

function parseError(err: unknown): Error {
  if (err instanceof Error) return err
  throw new Error(`${String(err)} is not an Error`)
}

/**
 * Checks the sources for correctness.
 *
 * @param {SnippetProcessingState} pState
 */
const validateSrcList = async (pState: SnippetProcessingState) => {
  const spinner = ora('Validating the sources…').start()
  try {
    const sourceValidation = validateSources(SOURCES)
    if (sourceValidation !== true) throw sourceValidation
    spinner.succeed('Sources are correct.')
  } catch (sve) {
    pState.error = parseError(sve)
    spinner.fail('Sources are empty.')
  }
}

/**
 * Displays the URLs from the source list
 *
 * @param {SnippetProcessingState} pState
 */
const printSourceList = async (pState: SnippetProcessingState) => {
  const spinner = ora('Preparing a source list…').start()
  let msg = 'Source list:\n'
  pState.sources.forEach((sourceUrl: SourceDefinition) => {
    msg += `* ${sourceUrl['url']}\n`
  })
  msg = msg.trimEnd()
  spinner.succeed(msg)
}

/**
 * Loads individual items from the source list
 *
 * @param {SnippetProcessingState} pState
 */
const collectPagesBeta = async (pState: SnippetProcessingState) => {
  if (pState.error === null) {
    const spinner = ora('Collecting pages in parallel').start()
    const sourcesNew: (SourceDefinition | Error)[] = await Promise.all(
      pState.sources.map((source: SourceDefinition) => collectPage(source, resolve(__dirname, '..'))),
    )
    pState.sources = []
    sourcesNew.forEach((source: SourceDefinition | Error) => {
      if (source instanceof Error) pState.error = source
      else pState.sources.push(source)
    })
    if (pState.error === null) spinner.succeed('Pages were downloaded.')
    else spinner.fail('Page downloading failed.')
  }
}

/**
 * Parses the pages with DST-parser
 *
 * @param {SnippetProcessingState} pState
 */
const parsePagesBeta = async (pState: SnippetProcessingState) => {
  pState.parsed = []
  const spinner = ora('Parsing available pages…').start()
  try {
    pState.sources.forEach((src: SourceDefinition) => {
      // Allow only the SourceDefinition instances with content
      if (src.content === undefined) throw new Error(`No content for ${src.url}`)
      // Parse content and fill the list in a "parsed" attribute
      const parserInst = new ExampleParser(src.content)
      const snippetMap = parserInst.mapLines()
      const tmpItems = Object.entries(snippetMap).map((sn) => {
        const snippet: IndividualSnippet = {
          name: sn[0],
          text: sn[1],
          version: src.version || '',
          lang: src.lang || '',
          url: src.url || '',
        }
        return snippet
      })
      pState.parsed.push(...tmpItems)
    })
    spinner.succeed('All pages parsed succesfully.')
  } catch (parserError) {
    pState.error = parseError(parserError)
    spinner.fail(`Parsing failed: ${String(parserError)}`)
  }
}

/**
 * Displays a list of the available snippets
 *
 * @param {SnippetProcessingState} pState
 */
const printAvailableSnippetsBeta = async (pState: SnippetProcessingState) => {
  const spinner = ora('Preparing a snippet list…').start()
  if (pState.parsed) {
    let msg = 'Snippet list:\n'
    pState.parsed.forEach((snippet: IndividualSnippet) => {
      msg += `* [${snippet.lang}] ${snippet.name}\n`
    })
    msg = msg.trimEnd()
    spinner.succeed(msg)
  } else {
    spinner.succeed('No snippets are currently available.')
  }
}

/**
 * Creates a snippet directory if it doesn't exist
 *
 * @param {SnippetProcessingState} pState
 */
const ensureSnippetDirBeta = async (pState: SnippetProcessingState) => {
  const spinner = ora('Ensuring snippet directory exists…').start()
  try {
    ensureDirExists(SNIPPET_SRC_DIR)
    pState.output_dir_accessible = true
    spinner.succeed(`Snippet dir: ${SNIPPET_SRC_DIR}`)
  } catch (ensureDirError) {
    pState.output_dir_accessible = false
    spinner.fail(`Unable to ensure output dir exists:\n${String(ensureDirError)}`)
  }
}

/**
 * Sets snippet filenames
 *
 * @param {SnippetProcessingState} pState
 */
const setSnippetNames = async (pState: SnippetProcessingState) => {
  // Snippets to record
  pState.output_strings = {}
  try {
    // Process snippets in the current group, filling the contents
    for (const key in pState.parsed) {
      const snippet: IndividualSnippet = pState.parsed[key]
      const snippetFilename = getSnippetFilename(snippet)
      pState.output_strings[snippetFilename] = snippet.text
    }
  } catch (fmtErr) {
    pState.error = parseError(fmtErr)
  }
}

/**
 * Export snippet metadata for a tabs component in JSON
 *
 * @param {SnippetProcessingState} pState
 */
const saveSnippetMeta = async (pState: SnippetProcessingState) => {
  const spinner = ora('Saving snippet metadata JSON…').start()
  try {
    // Record matches between filenames and the metadata
    const outputMeta: Record<string, { version: string; lang: string; name: string }> = {}
    // Process snippets in the current group, filling the contents
    for (const key in pState.parsed) {
      const rec: IndividualSnippet = pState.parsed[key]
      const snippetFilename = getSnippetFilename(rec)
      outputMeta[snippetFilename] = {
        version: rec.version,
        lang: rec.lang,
        name: rec.name,
      }
    }
    writeStrToFile(JSON.stringify(outputMeta, null, 4), join(SNIPPET_SRC_DIR, 'meta.json'))
    spinner.succeed('Snippet metadata was saved.')
  } catch (snmtErr) {
    pState.error = parseError(snmtErr)
    spinner.fail('Unable to save snippet metadata.')
  }
}

/**
 * Saves each snippet in its own file
 *
 * @param {SnippetProcessingState} pState
 */
const exportSnippetFilesBeta = async (pState: SnippetProcessingState) => {
  const sPrefix = 'Saving individual snippet files'
  const spinner = ora(`${sPrefix}…\n`).start()
  try {
    // Delete the previous directory contents
    // Write the snippets
    for (const filename in pState.output_strings) {
      const snippet: string = pState.output_strings[filename]
      spinner.text = `${sPrefix}: ${filename}`
      writeStrToFile(snippet, join(SNIPPET_SRC_DIR, filename))
    }
    // Finish
    spinner.succeed(`Individual snippet files are saved.`)
  } catch (writeError) {
    spinner.fail(`Unable to save the individual snippet files`)
  }
}

/**
 * Executes all currently required steps for
 * building the documentation.
 */
export async function main() {
  const pState: SnippetProcessingState = {
    error: null,
    output_dir_accessible: false,
    sources: SOURCES,
    parsing_result: null,
    parsed: [],
    output_strings: {},
  }
  await validateSrcList(pState)
  await printSourceList(pState)
  await collectPagesBeta(pState)
  await parsePagesBeta(pState)
  await printAvailableSnippetsBeta(pState)
  await ensureSnippetDirBeta(pState)
  await setSnippetNames(pState)
  await saveSnippetMeta(pState)
  await exportSnippetFilesBeta(pState)
}
