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

  it('adds an actionable message for OpenRouter credit-limit failures', async () => {
    process.env.OPENAI_EMBEDDING_BASE_URL = 'https://openrouter.ai/api/v1'
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
      "Prompt tokens limit exceeded: 7 > 2 (code: 402). OpenRouter rejected the embedding request because this account's prompt-token cap is too small for document indexing. Upgrade the OpenRouter account credits or point OPENAI_EMBEDDING_BASE_URL and OPENAI_EMBEDDING_API_KEY at an embedding provider with a larger context window.",
    )
  })
})
