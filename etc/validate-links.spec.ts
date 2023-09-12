import { describe, expect, test } from 'vitest'
import { LinkSelfAnchor, parseLink } from './validate-links'

describe('Parse link', () => {
  test('Parse self link', () => {
    const result = parseLink({
      root: '.',
      source: './a/b.html',
      href: '#afse',
    })

    expect(result).toEqual({ type: 'self', anchor: 'afse' } satisfies LinkSelfAnchor)
  })
})
