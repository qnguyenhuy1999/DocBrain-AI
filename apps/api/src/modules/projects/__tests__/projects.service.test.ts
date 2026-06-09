import { NotFoundException } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'
import { ProjectsService } from '../projects.service'

function makeProject(overrides: Partial<{
  id: string
  name: string
  description: string | null
  rootUrl: string | null
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
}> = {}) {
  return {
    id: 'project-1',
    name: 'Test Project',
    description: null,
    rootUrl: 'https://docs.example.com',
    status: 'ACTIVE' as const,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  }
}

function makePrisma(overrides: Record<string, unknown> = {}) {
  return {
    project: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    document: {
      groupBy: vi.fn().mockResolvedValue([]),
      aggregate: vi.fn().mockResolvedValue({ _count: { _all: 0 }, _max: { indexedAt: null } }),
    },
    ...overrides,
  }
}

describe('ProjectsService', () => {
  describe('createProject', () => {
    it('returns a project overview with zero metrics', async () => {
      const project = makeProject()
      const prisma = makePrisma()
      prisma.project.create = vi.fn().mockResolvedValue(project)

      const service = new ProjectsService(prisma as never)
      const result = await service.createProject({
        name: 'Test Project',
        rootUrl: 'https://docs.example.com',
      })

      expect(result.id).toBe('project-1')
      expect(result.name).toBe('Test Project')
      expect(result.documentCount).toBe(0)
      expect(result.readyCount).toBe(0)
      expect(result.failedCount).toBe(0)
      expect(result.processingCount).toBe(0)
      expect(result.pendingCount).toBe(0)
      expect(result.lastIndexedAt).toBeNull()
    })
  })

  describe('archiveProject', () => {
    it('calls update with ARCHIVED status', async () => {
      const project = makeProject({ status: 'ARCHIVED' })
      const prisma = makePrisma()
      prisma.project.findUnique = vi.fn().mockResolvedValue({ id: 'project-1' })
      prisma.project.update = vi.fn().mockResolvedValue(project)

      const service = new ProjectsService(prisma as never)
      await service.archiveProject('project-1')

      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'project-1' },
          data: expect.objectContaining({ status: 'ARCHIVED' }),
        }),
      )
    })
  })

  describe('getProject', () => {
    it('throws NotFoundException for unknown project id', async () => {
      const prisma = makePrisma()
      prisma.project.findUnique = vi.fn().mockResolvedValue(null)

      const service = new ProjectsService(prisma as never)

      await expect(service.getProject('unknown-id')).rejects.toThrow(NotFoundException)
    })
  })
})
