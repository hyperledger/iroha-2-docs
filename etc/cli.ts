import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { SNIPPET_SRC_DIR, SOURCES } from './const'
import { SnippetSourceDefinition } from './types'
import ora from 'ora'
import { concurrentTasks, parseDefinition, isAccessible } from './util'
import { match } from 'ts-pattern'
import fs from 'fs/promises'
import chalk from 'chalk'
import fetch from 'node-fetch'
import path from 'path'
import makeDir from 'make-dir'
import { deleteAsync } from 'del'

async function prepareOutputDir(options?: { clean?: boolean }) {
  const optionClean = options?.clean ?? false

  const dirDisplay = chalk.blue.bold(path.relative(process.cwd(), SNIPPET_SRC_DIR))
  const spinner = ora(optionClean ? `Re-recreating ${dirDisplay}` : `Creating ${dirDisplay} if not exists`)

  return Promise.resolve()
    .then<unknown>(() => optionClean && deleteAsync([SNIPPET_SRC_DIR]))
    .then(() => makeDir(SNIPPET_SRC_DIR))
    .then(() => spinner.succeed())
    .catch((err) => {
      spinner.fail()
      throw err
    })
}

async function processSnippet(source: SnippetSourceDefinition, options?: { force?: boolean }): Promise<void> {
  const spinner = ora()
  const srcDisplay = chalk.green.bold(source.src)

  const parsedDefinition = parseDefinition(source)

  if (parsedDefinition.type === 'error') {
    spinner.fail(`Invalid snippet source definition: ${parsedDefinition.err}`)
    throw new Error('Invalid src')
  }

  const writePath = path.join(SNIPPET_SRC_DIR, parsedDefinition.saveFilename)
  const writePathDisplay = chalk.blue.bold(path.relative(process.cwd(), writePath))

  if (!options?.force && (await isAccessible(writePath))) {
    spinner.succeed(`${writePathDisplay} exists, skipping update of ${srcDisplay}`)
    return
  }

  const fileContent: string = await match(parsedDefinition.source)
    .with({ type: 'fs-relative' }, async ({ path: snippetPath }) => {
      spinner.start(`Reading ${chalk.green.bold(snippetPath)}`)
      const content = await fs.readFile(snippetPath, { encoding: 'utf-8' }).catch((err) => {
        spinner.fail()
        throw err
      })
      return content
    })
    .with({ type: 'hyper' }, async ({ url }) => {
      spinner.start(`Fetching ${chalk.magenta.bold(url)}`)
      const content = await fetch(url)
        .then((x) => {
          if (x.ok) return x.text()
          throw new Error(`Failed to fetch: ${x.status}`)
        })
        .catch((err) => {
          spinner.fail()
          throw err
        })

      return content
    })
    .exhaustive()

  spinner.text = `Writing into ${writePathDisplay}`
  await fs.writeFile(writePath, fileContent)

  spinner.succeed(`Written ${writePathDisplay}`)
}

yargs(hideBin(process.argv))
  .command(
    'get-snippets',
    'Parses `snippet_sources.json` and collects all snippets',
    (y) => y.option('force', { type: 'boolean', default: false }),
    async (opts) => {
      await prepareOutputDir({ clean: opts.force })
      await concurrentTasks(SOURCES, (src) => processSnippet(src, { force: opts.force }))
      ora('Snippets are updated').succeed()
    },
  )
  .showHelpOnFail(false)
  .parse()
