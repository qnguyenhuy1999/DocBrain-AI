import type { Chunk, DocumentListItem, IndexProjectResponse } from '@docbrain/types'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { IndexerService } from './services/indexer.service'

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name)
  private readonly activeJobs = new Map<string, Promise<void>>()

  constructor(
    private readonly prisma: PrismaService,
    private readonly indexerService: IndexerService,
  ) {}

  async indexProject(projectId: string, maxPages: number): Promise<IndexProjectResponse> {
    await this.assertProjectExists(projectId)

    if (this.activeJobs.has(projectId)) {
      return { projectId, status: 'ALREADY_RUNNING' }
    }

    const job: Promise<void> = this.indexerService
      .indexProject(projectId, maxPages)
      .then(() => undefined)
      .catch((error: unknown) => {
        this.logger.error(`Indexing failed for project ${projectId}`, error)
      })
      .finally(() => {
        this.activeJobs.delete(projectId)
      })

    this.activeJobs.set(projectId, job)

    return { projectId, status: 'STARTED' }
  }

  async getProjectDocuments(projectId: string): Promise<DocumentListItem[]> {
    await this.assertProjectExists(projectId)

    const documents = await this.prisma.document.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            chunks: true,
          },
        },
      },
      orderBy: [{ indexedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return documents.map((document) => ({
      id: document.id,
      projectId: document.projectId,
      title: document.title,
      sourceType: document.sourceType,
      sourceUrl: document.sourceUrl,
      markdown: document.markdown,
      contentHash: document.contentHash,
      status: document.status,
      errorMessage: document.errorMessage,
      indexedAt: document.indexedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      chunkCount: document._count.chunks,
    }))
  }

  async getProjectChunks(projectId: string, documentId?: string): Promise<Chunk[]> {
    await this.assertProjectExists(projectId)

    return this.prisma.chunk.findMany({
      where: {
        document: {
          projectId,
        },
        ...(documentId ? { documentId } : {}),
      },
      orderBy: [{ documentId: 'asc' }, { chunkIndex: 'asc' }],
    })
  }

  private async assertProjectExists(projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }
  }
}
