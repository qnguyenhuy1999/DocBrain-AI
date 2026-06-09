import type { ID } from './common'

export interface RetrievalMatch {
  chunkId: ID
  documentId: ID
  title: string
  sourceUrl?: string | null
  section?: string | null
  content: string
  score: number
  chunkIndex: number
}

export interface RetrieveResponse {
  query: string
  topK: number
  returnedCount: number
  minScore?: number
  matches: RetrievalMatch[]
}
