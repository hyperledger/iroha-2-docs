import { test, expect, describe } from 'vitest'
import { SnippetSourceDefinition } from './types'
import { ParseDefinitionResult, parseSnippetSrc, parseDefinition } from './util'

describe('Parse snippet src', () => {
  test.each([
    ['./src/snippet.ts', { type: 'fs-relative', path: './src/snippet.ts' }],
    ['http://github.com', { type: 'hyper', url: 'http://github.com' }],
    ['/abs', { type: 'error' }],
  ])('Parses %o to %o', (input, result) => {
    expect(parseSnippetSrc(input)).toEqual(result)
  })
})

describe('Parse snippet source definition', () => {
  test.each([
    [{ src: './hey' }, { type: 'ok', saveFilename: 'hey', source: { type: 'fs-relative', path: './hey' } }],
    [{ src: 'ffas' }, { type: 'error', err: new Error('"ffas" is not a valid src') }],
    [
      { src: 'https://github.com/file.ts', filename: 'override.ts' },
      { type: 'ok', source: { type: 'hyper', url: 'https://github.com/file.ts' }, saveFilename: 'override.ts' },
    ],
  ] as [SnippetSourceDefinition, ParseDefinitionResult][])('Parses %o to %o', (input, output) => {
    expect(parseDefinition(input)).toEqual(output)
  })
})
