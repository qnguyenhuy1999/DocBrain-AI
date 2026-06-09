import type { Citation, RetrievalMatch } from '@docbrain/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CitationBuilderService {
  build(matches: RetrievalMatch[]): Citation[] {
    return matches.map((match) => ({
      chunkId: match.chunkId,
      documentId: match.documentId,
      title: match.title,
      sourceUrl: match.sourceUrl,
      section: match.section,
      score: match.score,
    }))
  }
}
