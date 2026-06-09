import type { IndexProjectResponse } from '@docbrain/types'
import type { Chunk, Document } from '@docbrain/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { IndexerService } from './services/indexer.service'

@Injectable()
export class IngestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly indexerService: IndexerService,
  ) {}

  async indexProject(projectId: string, maxPages: number): Promise<IndexProjectResponse> {
    const summary = await this.indexerService.indexProject(projectId, maxPages)

    return {
      projectId,
      status: 'COMPLETED',
      summary,
    }
  }

  async getProjectDocuments(projectId: string): Promise<Document[]> {
    await this.assertProjectExists(projectId)

    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: [{ indexedAt: 'desc' }, { createdAt: 'desc' }],
    })
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
