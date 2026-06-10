import { describe, expect, it, vi } from 'vitest'
import { EMBEDDING_DIMENSIONS } from '@docbrain/config'
import { EmbeddingService } from '../embedding.service'

describe('EmbeddingService', () => {
  it('returns embeddings from a valid provider payload', async () => {
    process.env.OPENAI_EMBEDDING_BASE_URL = 'https://example.com/v1'
    process.env.OPENAI_EMBEDDING_API_KEY = 'test-key'

    const service = new EmbeddingService()
    const create = vi.fn().mockResolvedValue({
      data: [
        { embedding: new Array(EMBEDDING_DIMENSIONS).fill(0.1) },
        { embedding: new Array(EMBEDDING_DIMENSIONS).fill(0.2) },
      ],
    })

    ;(service as any).client = {
      embeddings: {
        create,
      },
    }

    await expect(service.generateEmbeddings(['first', 'second'])).resolves.toHaveLength(2)
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('surfaces provider error payloads instead of crashing on response.data', async () => {
    process.env.OPENAI_EMBEDDING_BASE_URL = 'https://example.com/v1'
    process.env.OPENAI_EMBEDDING_API_KEY = 'test-key'

    const service = new EmbeddingService()

    ;(service as any).client = {
      embeddings: {
        create: vi.fn().mockResolvedValue({
          error: {
            message: 'Prompt tokens limit exceeded: 7 > 2',
            code: 402,
          },
        }),
      },
    }

    await expect(service.generateEmbeddings(['hello world', 'second sample'])).rejects.toThrow(
      'Prompt tokens limit exceeded: 7 > 2 (code: 402)',
    )
  })
})
