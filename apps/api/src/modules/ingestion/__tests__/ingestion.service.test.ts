import { NotFoundException } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'
import { IngestionService } from '../ingestion.service'

function makePrisma(overrides: Record<string, unknown> = {}) {
  return {
    project: {
      findUnique: vi.fn(),
    },
    document: {
      findMany: vi.fn(),
    },
    chunk: {
      findMany: vi.fn(),
    },
    ...overrides,
  }
}

const stubIndexer = {
  indexProject: vi.fn().mockResolvedValue(undefined),
}

describe('IngestionService', () => {
  describe('getProjectDocuments', () => {
    it('returns documents with chunkCount from _count.chunks', async () => {
      const prisma = makePrisma()
      prisma.project.findUnique = vi.fn().mockResolvedValue({ id: 'project-1', status: 'ACTIVE' })
      prisma.document.findMany = vi.fn().mockResolvedValue([
        {
          id: 'doc-1',
          projectId: 'project-1',
          title: 'Getting Started',
          sourceType: 'WEB',
          sourceUrl: 'https://docs.example.com/start',
          markdown: '# Getting Started',
          contentHash: 'abc123',
          status: 'READY',
          errorMessage: null,
          indexedAt: new Date('2026-06-01T00:00:00.000Z'),
          createdAt: new Date('2026-06-01T00:00:00.000Z'),
          updatedAt: new Date('2026-06-01T00:00:00.000Z'),
          _count: { chunks: 5 },
        },
      ])

      const service = new IngestionService(prisma as never, stubIndexer as never)
      const docs = await service.getProjectDocuments('project-1')

      expect(docs).toHaveLength(1)
      expect(docs[0]?.chunkCount).toBe(5)
      expect(docs[0]?.id).toBe('doc-1')
    })
  })

  describe('indexProject', () => {
    it('returns ALREADY_RUNNING when a job is active for the project', async () => {
      const prisma = makePrisma()
      prisma.project.findUnique = vi.fn().mockResolvedValue({ id: 'project-1', status: 'ACTIVE' })

      // Never-resolving promise simulates an active job
      const neverResolves = new Promise<void>(() => undefined)
      const slowIndexer = { indexProject: vi.fn().mockReturnValue(neverResolves) }

      const service = new IngestionService(prisma as never, slowIndexer as never)

      // Start first job — puts it in activeJobs
      await service.indexProject('project-1', 10)

      // Second call should see the active job
      const result = await service.indexProject('project-1', 10)
      expect(result.status).toBe('ALREADY_RUNNING')
    })

    it('throws NotFoundException when project does not exist', async () => {
      const prisma = makePrisma()
      prisma.project.findUnique = vi.fn().mockResolvedValue(null)

      const service = new IngestionService(prisma as never, stubIndexer as never)

      await expect(service.indexProject('unknown-id', 10)).rejects.toThrow(NotFoundException)
    })
  })
})
