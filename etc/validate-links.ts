import { readFile } from 'fs/promises'
import chalk from 'chalk'
import { P, match } from 'ts-pattern'
import { globby } from 'globby'
import path from 'path'
import * as htmlparser from 'htmlparser2'
import * as cssSelect from 'css-select'
import leven from 'leven'

interface Options {
  root: string
  publicPath?: string
}

type LinkIssues = Map<string, LinkIssue[]>

type LinkIssue = IssueMissingOtherFile | IssueMissingAnchorInOtherFile | IssueMissingAnchorInSelf

interface IssueMissingOtherFile {
  type: 'missing-other-file'
  file: string
}

interface IssueMissingAnchorInOtherFile {
  type: 'missing-id-in-other'
  file: string
  id: string
  similar?: string[]
}

interface IssueMissingAnchorInSelf {
  type: 'missing-id-in-self'
  id: string
  similar?: string[]
}

export async function scanAndReport(options: Options) {
  const issues = await scan(options)

  const count = countIssues(issues)
  if (count === 0) {
    console.log('OK havent found any issues')
  } else {
    const sortByFileName = <T extends [string, any]>(items: T[]): T[] => {
      const arr = [...items]
      arr.sort(([a], [b]) => {
        return a < b ? -1 : a > b ? 1 : 0
      })
      return arr
    }

    const formatFile = (file: string): string => {
      const relative = path.relative(options.root, file)
      const ext = path.extname(relative)
      return chalk`${relative.slice(0, -ext.length)}{reset.dim ${ext}}`
    }

    const formatSimilar = (items?: string[]) => {
      if (!items?.length) return ''
      return `. Here are similar ones:\n      ` + items.map((x) => chalk.blue(x)).join('\n      ')
    }

    const formattedIssues = sortByFileName([...issues])
      .map(([file, issues]) => {
        const issuesFormatted: string = issues
          .map((issue) => {
            return (
              match(issue)
                // actually, it should never happen: VitePress disallows dead links to other pages
                .with({ type: 'missing-other-file' }, (x) => {
                  return chalk`  Broken link: {bold.red ${formatFile(x.file)}}\n    Cannot find the file.`
                })
                .with({ type: 'missing-id-in-other' }, (x) => {
                  return (
                    chalk`  Broken link: {bold ${formatFile(x.file)}{red #${
                      x.id
                    }}}\n    Cannot find the ID in the other file` + formatSimilar(x.similar)
                  )
                })
                .with({ type: 'missing-id-in-self' }, (x) => {
                  return (
                    chalk`  Broken link: {bold.red #${x.id}}\n    Cannot find the ID within the file itself` +
                    formatSimilar(x.similar)
                  )
                })
                .exhaustive()
            )
          })
          .join('\n\n')

        return `${chalk.underline.bold(formatFile(file))} (issues: ${issues.length})\n${issuesFormatted}`
      })
      .join('\n\n')

    console.error(
      `${formattedIssues}\n\n${chalk.red(`× Found broken links. Total issues count: ${chalk.bold(count)}`)}`,
    )
    process.exit(1)
  }
}

function countIssues(issues: LinkIssues): number {
  let count = 0
  for (const x of issues.values()) {
    count += x.length
  }
  return count
}

async function scan(options: Options): Promise<LinkIssues> {
  const files = await findFiles(options.root)

  const entries = await Promise.all(
    files.map(async (file) => {
      const html = await readFile(file, { encoding: 'utf-8' })
      const { links, anchors } = scanLinksAndAnchorsInHTML(html)

      const parsedLinks = links
        .map((x) => parseLink({ root: options.root, source: file, href: x }))
        .filter((x): x is Exclude<ParsedLink, LinkExternal> => x.type !== 'external')

      return { file, links: parsedLinks, anchors }
    }),
  )

  const graph = entries.reduce<Graph>((acc, { file, links, anchors }) => {
    acc.set(file, { links, anchors })
    return acc
  }, new Map())

  return findIssuesInGraph(graph)
}

async function findFiles(root: string): Promise<string[]> {
  return globby(path.join(root, '**/*.html'))
}

function scanLinksAndAnchorsInHTML(html: string): {
  links: string[]
  anchors: Set<string>
} {
  const doc = htmlparser.parseDocument(html)

  const links = cssSelect.selectAll('main a[href]', doc.children).map((elem) => {
    const href = match(elem)
      .with({ name: 'a', attribs: { href: P.select(P.string) } }, (href) => href)
      .otherwise(() => {
        throw new Error('unexpected <a>')
      })

    return href
  })

  const anchors = new Set(
    cssSelect.selectAll('main [id]', doc.children).map((elem) => {
      const id = match(elem)
        .with({ attribs: { id: P.select(P.string) } }, (id) => id)
        .otherwise(() => {
          throw new Error('unexpected element')
        })

      return id
    }),
  )

  return { links, anchors }
}

type ParsedLink = LinkSelfAnchor | LinkOtherFile | LinkExternal

export interface LinkSelfAnchor {
  type: 'self'
  anchor: string
}

export interface LinkOtherFile {
  type: 'other'
  file: string
  anchor?: string
}

export interface LinkExternal {
  type: 'external'
  url: URL
}

// export for tests
export function parseLink(opts: { root: string; source: string; href: string }): ParsedLink {
  const relative = path.relative(opts.root, opts.source)
  const DUMMY_ORIGIN = 'http://dummy.dummy'
  const url = new URL(opts.href, DUMMY_ORIGIN + `/${relative}`)

  return match(url)
    .with(
      { origin: DUMMY_ORIGIN, pathname: P.select('pathname'), hash: P.select('hash') },
      ({ pathname, hash }): ParsedLink => {
        const anchor = hash ? hash.slice(1) : undefined
        let file = path.join(opts.root, pathname)
        if (file.endsWith('/')) file += `index.html`

        if (path.normalize(file) === path.normalize(opts.source)) {
          if (!anchor) throw new Error('found self link without anchor')
          return { type: 'self', anchor }
        }

        return {
          type: 'other',
          file,
          anchor,
        }
      },
    )
    .otherwise((url): ParsedLink => {
      return {
        type: 'external',
        url,
      }
    })
}

type Graph = Map<string, { links: Exclude<ParsedLink, LinkExternal>[]; anchors: Set<string> }>

function findIssuesInGraph(graph: Graph): LinkIssues {
  const issues: LinkIssues = new Map()

  for (const [file, { links, anchors: selfAnchors }] of graph) {
    const fileIssues: LinkIssue[] = []

    for (const link of links) {
      match(link)
        .with({ type: 'self' }, ({ anchor }) => {
          if (!selfAnchors.has(anchor))
            fileIssues.push({
              type: 'missing-id-in-self',
              id: anchor,
              similar: findSimilarIds(selfAnchors, anchor),
            })
        })
        .with({ type: 'other' }, ({ file: otherFile, anchor }) => {
          const otherFileInGraph = graph.get(otherFile)
          if (!otherFileInGraph) {
            fileIssues.push({
              type: 'missing-other-file',
              file: otherFile,
            })
          } else if (anchor && !otherFileInGraph.anchors.has(anchor)) {
            fileIssues.push({
              type: 'missing-id-in-other',
              file: otherFile,
              id: anchor,
              similar: findSimilarIds(otherFileInGraph.anchors, anchor),
            })
          }
        })
        .otherwise(() => {})
    }

    if (fileIssues.length) issues.set(file, fileIssues)
  }

  return issues
}

function findSimilarIds(existing: Set<string>, id: string): string[] {
  return [...existing].filter((x) => {
    const distance = leven(x, id)
    return distance >= 1 && distance <= 3 // todo: 3
  })
}
