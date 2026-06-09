import { describe, expect, it } from 'vitest'
import { CitationBuilderService } from '../citation-builder.service'

describe('CitationBuilderService', () => {
  it('maps retrieval matches into persisted citations', () => {
    const service = new CitationBuilderService()

    expect(
      service.build([
        {
          chunkId: 'chunk-1',
          documentId: 'document-1',
          title: 'Getting Started',
          sourceUrl: 'https://example.com/start',
          section: 'Quick Start',
          content: 'Install dependencies first.',
          score: 0.87,
          chunkIndex: 0,
        },
      ]),
    ).toEqual([
      {
        chunkId: 'chunk-1',
        documentId: 'document-1',
        title: 'Getting Started',
        sourceUrl: 'https://example.com/start',
        section: 'Quick Start',
        score: 0.87,
      },
    ])
  })
})
