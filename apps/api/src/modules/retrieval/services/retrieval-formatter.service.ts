import type { RetrieveResponse, RetrievalMatch } from '@docbrain/types'
import { Injectable } from '@nestjs/common'
import type { RetrievalRow } from './vector-search.service'

@Injectable()
export class RetrievalFormatterService {
  format(query: string, rows: RetrievalRow[]): RetrieveResponse {
    return {
      query,
      matches: rows.map((row) => this.formatRow(row)),
    }
  }

  private formatRow(row: RetrievalRow): RetrievalMatch {
    const scoreValue = typeof row.score === 'string' ? Number(row.score) : (row.score ?? 0)
    const score = Number.isFinite(scoreValue) ? Math.min(1, Math.max(0, scoreValue)) : 0

    return {
      chunkId: row.chunkId,
      documentId: row.documentId,
      title: row.title,
      sourceUrl: row.sourceUrl,
      section: row.section,
      content: row.content,
      score,
      chunkIndex: row.chunkIndex,
    }
  }
}
