/**
 * @module Utilities
 *
 * Common utilities, used by the documentation scripts.
 */

import { join } from 'path'
import axios from 'axios'
import { IndividualSnippet, SourceDefinition } from './types.mjs'
import { pathToStr } from './file_utils.mjs'
import { langExtensions } from './constants.mjs'

/**
 * Checks if the source definitions are formatted correctly
 *
 * @param sources - a list of sources to be validated
 */
export const validateSources = (sources: SourceDefinition[]): true | Error => {
  let result: true | Error
  if (sources.constructor.name == 'Array') {
    if (sources.length === 0) {
      result = new Error('URL list should not be empty')
    } else {
      result = true
    }
  } else if (sources instanceof Error) result = sources
  else result = new Error('URL list should contain a list')
  return result
}

/**
 * Retrieves a URL. Supports http, https and file URLs.
 *
 * @param source - definition for a source to retrieve a page, FS or not
 * @param lookupPath - a path for file contents to support relative and absolute paths
 */
export const collectPage = async (source: SourceDefinition, lookupPath: string): Promise<SourceDefinition | Error> => {
  let result: SourceDefinition | Error
  if (source.url.startsWith('http://') || source.url.startsWith('https://')) {
    const resp: string | Error = await axios({
      method: 'get',
      url: source.url,
    })
      .then((resp) => {
        return resp.data
      })
      .catch((error) => {
        return new Error(
          `Unable to retrieve a page.\n` +
            `HTTP status: ${error.response.status}.\n` +
            `Status text: ${error.response.statusText}.`,
        )
      })
    result = Object.assign(source, { content: resp })
  } else if (source.url.startsWith('/')) {
    const fileContent = pathToStr(source.url)
    result = { ...source, content: fileContent }
  } else if (source.url.startsWith('.')) {
    const resolvedPath: string = join(lookupPath, source.url.slice(2))
    const fileContent = pathToStr(resolvedPath)
    result = { ...source, content: fileContent }
  } else {
    result = new Error(`Wrong URL format: ${source.url}`)
  }
  return result
}

/**
 * Converts a language name to file extension; case—insensitive.
 *
 * @param lang - a language name
 * @returns a file extension appropriate for a given language
 */
export const langToFileExt = (lang: string): string => {
  const ll = lang.toLowerCase()
  return ll in langExtensions ? langExtensions[ll] : ''
}

/**
 * Formats an individual snippet filename
 *
 * @param snippet - snippet data needed from formatting
 * @returns snippet filename with an extension
 */
export const getSnippetFilename = function (snippet: IndividualSnippet): string {
  const ext = langToFileExt(snippet.lang)
  return `${snippet.version}_${snippet.lang}_${snippet.name}.${ext}`
}
