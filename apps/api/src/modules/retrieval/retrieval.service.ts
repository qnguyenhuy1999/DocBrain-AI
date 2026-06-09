import type { RetrieveResponse } from '@docbrain/types'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { EmbeddingService } from '../ingestion/services/embedding.service'
import { RetrievalFormatterService } from './services/retrieval-formatter.service'
import { VectorSearchService } from './services/vector-search.service'

@Injectable()
export class RetrievalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly vectorSearchService: VectorSearchService,
    private readonly retrievalFormatterService: RetrievalFormatterService,
  ) {}

  async retrieve(projectId: string, query: string, topK: number): Promise<RetrieveResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }

    if (!query.trim()) {
      throw new BadRequestException('Query must not be empty')
    }

    const readyDocumentCount = await this.prisma.document.count({
      where: {
        projectId,
        status: 'READY',
      },
    })

    if (readyDocumentCount === 0) {
      throw new BadRequestException(`Project ${projectId} does not have any READY documents`)
    }

    const queryVector = await this.embeddingService.embedQuery(query)
    const rows = await this.vectorSearchService.search(projectId, queryVector, topK)

    return this.retrievalFormatterService.format(query, rows)
  }
}
