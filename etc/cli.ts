import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { SNIPPET_SRC_DIR, SOURCES } from './const'
import { SnippetSourceDefinition } from './types'
import ora from 'ora'
import { concurrentTasks, parseDefinition } from './util'
import { match, P } from 'ts-pattern'
import fs from 'fs/promises'
import chalk from 'chalk'
import fetch from 'node-fetch'
import path from 'path'
import makeDir from 'make-dir'
import { deleteAsync } from 'del'

async function prepareOutputDir() {
  const spinner = ora(`Re-recreating ${chalk.blue.bold(path.relative(process.cwd(), SNIPPET_SRC_DIR))}`)
  return deleteAsync([SNIPPET_SRC_DIR])
    .then(() => makeDir(SNIPPET_SRC_DIR))
    .then(() => spinner.succeed())
    .catch((err) => {
      spinner.fail()
      throw err
    })
}

async function processSnippet(source: SnippetSourceDefinition): Promise<void> {
  const spinner = ora('asdf')

  const parsedDefinition = parseDefinition(source)

  if (parsedDefinition.type === 'error') {
    spinner.fail(`Invalid snippet source definition: ${parsedDefinition.err}`)
    throw new Error('Invalid src')
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
      spinner.start(`Fetching ${chalk.green.bold(url)}`)
      const content = await fetch(url)
        .then((x) => {
          if (x.ok) return x.text()
          throw new Error(`Failed to fetch: ${x.status}`)
        })
        .catch((err) => {
          spinner.fail()
          throw err
        })

      await new Promise((r) => setTimeout(r, Math.random() * 5_000))
      return content
    })
    .exhaustive()

  const writePath = path.join(SNIPPET_SRC_DIR, parsedDefinition.saveFilename)

  spinner.text = `Writing ${chalk.green.bold(source.src)} into ${chalk.blue.bold(
    path.relative(process.cwd(), writePath),
  )}`
  await fs.writeFile(writePath, fileContent)

  spinner.succeed()
}

yargs(hideBin(process.argv))
  .command('get-snippets', 'todo', {}, async () => {
    await prepareOutputDir()
    await concurrentTasks(SOURCES, processSnippet)
    ora('Snippets are updated').succeed()
  })
  .showHelpOnFail(false)
  .parse()
