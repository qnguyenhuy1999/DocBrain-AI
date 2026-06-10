import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { toVectorSql } from '../../../common/vector/vector-sql'

export interface RetrievalRow {
  chunkId: string
  documentId: string
  title: string
  sourceUrl: string | null
  section: string | null
  content: string
  chunkIndex: number
  score: number | string | null
}

@Injectable()
export class VectorSearchService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async search(projectId: string, queryVector: number[], topK: number): Promise<RetrievalRow[]> {
    const vectorSql = toVectorSql(queryVector)

    return this.prisma.$queryRaw<RetrievalRow[]>`
      SELECT
        c.id AS "chunkId",
        c."documentId" AS "documentId",
        d.title AS "title",
        d."sourceUrl" AS "sourceUrl",
        c.section AS "section",
        c.content AS "content",
        c."chunkIndex" AS "chunkIndex",
        1 - (e.vector <=> ${vectorSql}) AS "score"
      FROM "embeddings" e
      JOIN "chunks" c ON c.id = e."chunkId"
      JOIN "documents" d ON d.id = c."documentId"
      WHERE d."projectId" = ${projectId}
        AND d.status = 'READY'
      ORDER BY e.vector <=> ${vectorSql}
      LIMIT ${topK}
    `
  }
}
