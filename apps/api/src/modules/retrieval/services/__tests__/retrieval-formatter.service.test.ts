import { describe, expect, it } from 'vitest'
import { RetrievalFormatterService } from '../retrieval-formatter.service'

describe('RetrievalFormatterService', () => {
  const service = new RetrievalFormatterService()

  it('formats and clamps retrieval scores', () => {
    const response = service.format(
      'setup',
      [
        {
          chunkId: 'chunk-1',
          documentId: 'document-1',
          title: 'Getting Started',
          sourceUrl: 'https://example.com/start',
          section: 'Quick Start',
          content: 'Install dependencies first.',
          chunkIndex: 2,
          score: '1.5',
        },
        {
          chunkId: 'chunk-2',
          documentId: 'document-2',
          title: 'Troubleshooting',
          sourceUrl: null,
          section: null,
          content: 'Check environment variables.',
          chunkIndex: 0,
          score: -0.2,
        },
      ],
      {
        topK: 5,
        minScore: 0,
      },
    )

    expect(response).toEqual({
      query: 'setup',
      topK: 5,
      returnedCount: 2,
      minScore: 0,
      matches: [
        {
          chunkId: 'chunk-1',
          documentId: 'document-1',
          title: 'Getting Started',
          sourceUrl: 'https://example.com/start',
          section: 'Quick Start',
          content: 'Install dependencies first.',
          chunkIndex: 2,
          score: 1,
        },
        {
          chunkId: 'chunk-2',
          documentId: 'document-2',
          title: 'Troubleshooting',
          sourceUrl: null,
          section: null,
          content: 'Check environment variables.',
          chunkIndex: 0,
          score: 0,
        },
      ],
    })
  })

  it('filters out matches below the minimum score', () => {
    const response = service.format(
      'setup',
      [
        {
          chunkId: 'chunk-1',
          documentId: 'document-1',
          title: 'Getting Started',
          sourceUrl: 'https://example.com/start',
          section: 'Quick Start',
          content: 'Install dependencies first.',
          chunkIndex: 2,
          score: 0.91,
        },
        {
          chunkId: 'chunk-2',
          documentId: 'document-2',
          title: 'Troubleshooting',
          sourceUrl: null,
          section: null,
          content: 'Check environment variables.',
          chunkIndex: 0,
          score: 0.12,
        },
      ],
      {
        topK: 5,
        minScore: 0.35,
      },
    )

    expect(response.returnedCount).toBe(1)
    expect(response.matches).toHaveLength(1)
    expect(response.matches[0]?.chunkId).toBe('chunk-1')
  })
})
