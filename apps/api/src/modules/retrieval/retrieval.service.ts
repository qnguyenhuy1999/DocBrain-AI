import { MIN_RETRIEVAL_SCORE, RAG_TOP_K } from '@docbrain/config'
import type { RetrieveResponse } from '@docbrain/types'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { EmbeddingService } from '../ingestion/services/embedding.service'
import { RetrievalFormatterService } from './services/retrieval-formatter.service'
import { VectorSearchService } from './services/vector-search.service'

export interface RetrieveOptions {
  topK?: number
  minScore?: number
}

@Injectable()
export class RetrievalService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EmbeddingService) private readonly embeddingService: EmbeddingService,
    @Inject(VectorSearchService) private readonly vectorSearchService: VectorSearchService,
    @Inject(RetrievalFormatterService)
    private readonly retrievalFormatterService: RetrievalFormatterService,
  ) {}

  async retrieve(projectId: string, query: string, options: RetrieveOptions = {}): Promise<RetrieveResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }

    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      throw new BadRequestException('Query must not be empty')
    }

    const topK = options.topK ?? RAG_TOP_K
    const minScore = options.minScore ?? MIN_RETRIEVAL_SCORE

    const readyDocumentCount = await this.prisma.document.count({
      where: {
        projectId,
        status: 'READY',
      },
    })

    if (readyDocumentCount === 0) {
      throw new BadRequestException(`Project ${projectId} does not have any READY documents`)
    }

    const queryVector = await this.embeddingService.embedQuery(normalizedQuery)
    const rows = await this.vectorSearchService.search(projectId, queryVector, topK)

    return this.retrievalFormatterService.format(normalizedQuery, rows, {
      topK,
      minScore,
    })
  }
}
