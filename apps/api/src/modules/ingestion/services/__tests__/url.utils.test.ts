import { describe, expect, it } from 'vitest'
import { createUrlLabel, normalizeDiscoveredUrl } from '../url.utils'

describe('url.utils', () => {
  it('normalizes same-origin URLs and strips query/hash', () => {
    expect(
      normalizeDiscoveredUrl(
        'https://docs.example.com/guide/getting-started/?ref=nav#install',
        'https://docs.example.com',
      ),
    ).toBe('https://docs.example.com/guide/getting-started')
  })

  it('filters blocked and non-document URLs', () => {
    expect(normalizeDiscoveredUrl('https://docs.example.com/login', 'https://docs.example.com')).toBe(
      null,
    )
    expect(
      normalizeDiscoveredUrl('https://cdn.example.com/file.pdf', 'https://docs.example.com'),
    ).toBe(null)
  })

  it('creates readable labels from URLs', () => {
    expect(createUrlLabel('https://docs.example.com/getting-started_here')).toBe(
      'Getting Started Here',
    )
  })
})
