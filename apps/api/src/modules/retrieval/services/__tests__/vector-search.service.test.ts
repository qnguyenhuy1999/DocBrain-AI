import { EMBEDDING_DIMENSIONS } from '@docbrain/config'
import { describe, expect, it, vi } from 'vitest'
import { VectorSearchService } from '../vector-search.service'

describe('VectorSearchService', () => {
  it('builds a READY-only similarity query with a limit', async () => {
    const queryRaw = vi.fn().mockResolvedValue([])
    const prisma = {
      $queryRaw: queryRaw,
    }

    const service = new VectorSearchService(prisma as never)
    const queryVector = Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0.1)

    await service.search('project-1', queryVector, 7)

    expect(queryRaw).toHaveBeenCalledTimes(1)
    const templateStrings = queryRaw.mock.calls[0]?.[0] as TemplateStringsArray
    const templateText = templateStrings.join(' ')

    expect(templateText).toContain('FROM "embeddings" e')
    expect(templateText).toContain('d.status = \'READY\'')
    expect(templateText).toContain('LIMIT')
  })
})
