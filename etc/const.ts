import path from 'path'
import SOURCES_UNTYPED from '../snippet_sources.json'
import { SnippetSourceDefinition } from './types'

export const SOURCES: SnippetSourceDefinition[] = SOURCES_UNTYPED

export const SNIPPET_SRC_DIR = path.resolve(__dirname, '../src/snippets')
