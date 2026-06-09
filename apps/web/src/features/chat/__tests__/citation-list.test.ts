import { describe, expect, it } from 'vitest'
import type { Citation } from '@docbrain/types'

// Mirrors the render logic in CitationList:
// - returns null when citations is empty
// - maps citations to numbered items [1], [2], ...
// - includes sourceUrl when present
function buildCitationItems(citations: Citation[]) {
  if (citations.length === 0) {
    return null
  }

  return citations.map((citation, index) => ({
    number: `[${index + 1}]`,
    title: citation.title,
    section: citation.section ?? 'Untitled section',
    score: citation.score,
    sourceUrl: citation.sourceUrl ?? null,
  }))
}

function makeCitation(overrides: Partial<Citation> = {}): Citation {
  return {
    chunkId: 'chunk-1',
    documentId: 'doc-1',
    title: 'Getting Started',
    sourceUrl: null,
    section: 'Quick Start',
    score: 0.9,
    ...overrides,
  }
}

describe('CitationList logic', () => {
  it('returns null when citations array is empty', () => {
    expect(buildCitationItems([])).toBeNull()
  })

  it('renders numbered citations [1], [2] for multiple items', () => {
    const items = buildCitationItems([
      makeCitation({ title: 'First' }),
      makeCitation({ chunkId: 'chunk-2', title: 'Second' }),
    ])

    expect(items).not.toBeNull()
    expect(items).toHaveLength(2)
    expect(items![0]?.number).toBe('[1]')
    expect(items![1]?.number).toBe('[2]')
    expect(items![0]?.title).toBe('First')
    expect(items![1]?.title).toBe('Second')
  })

  it('includes sourceUrl when present', () => {
    const items = buildCitationItems([
      makeCitation({ sourceUrl: 'https://docs.example.com/start' }),
    ])

    expect(items![0]?.sourceUrl).toBe('https://docs.example.com/start')
  })

  it('has null sourceUrl when not provided', () => {
    const items = buildCitationItems([makeCitation({ sourceUrl: null })])

    expect(items![0]?.sourceUrl).toBeNull()
  })
})
