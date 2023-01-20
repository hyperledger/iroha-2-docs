import { SnippetSourceDefinition } from './types'
import { match, P } from 'ts-pattern'
import path from 'path'
import fs from 'fs/promises'

export async function isAccessible(path: string): Promise<boolean> {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

export function parseSnippetSrc(src: string): ParsedSource {
  if (/^http(s)?:\/\//.test(src)) return { type: 'hyper', url: src }
  return { type: 'fs', path: src }
}

type ParsedSource = { type: 'fs'; path: string } | { type: 'hyper'; url: string }

interface ParsedSnippetDefinition {
  source: ParsedSource
  saveFilename: string
}

export type ParseDefinitionResult = ({ type: 'ok' } & ParsedSnippetDefinition) | { type: 'error'; err: Error }

export function parseDefinition(definition: SnippetSourceDefinition): ParseDefinitionResult {
  return match(parseSnippetSrc(definition.src))
    .with({ type: P.union('fs', 'hyper') }, (source): ParseDefinitionResult => {
      let saveFilename: string

      if (definition.filename) {
        saveFilename = definition.filename
      } else {
        const uri = match(source)
          .with({ type: 'fs' }, (x) => x.path)
          .with({ type: 'hyper' }, (x) => x.url)
          .exhaustive()

        saveFilename = path.basename(uri)
      }

      return { type: 'ok', source, saveFilename }
    })
    .exhaustive()
}

export function concurrentTasks<T>(data: T[], fn: (data: T) => Promise<void>, maxConcurrency = 10): Promise<void> {
  let cursor = 0
  let wip = 0

  let resolve: () => void
  let reject: (reason?: unknown) => void
  const promise = new Promise<void>((promResolve, promReject) => {
    resolve = promResolve
    reject = promReject
  })

  function handleResolve() {
    wip--
    if (!wip && cursor === data.length) resolve()
    else executeTasks()
  }

  function handleReject(reason?: unknown) {
    reject(reason)
  }

  function executeTasks() {
    while (wip < maxConcurrency && cursor < data.length) {
      const dataItem = data[cursor++]
      fn(dataItem).then(handleResolve).catch(handleReject)
      wip++
    }
  }

  executeTasks()
  return promise
}
