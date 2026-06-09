import type { ID } from './common'

export interface Chunk {
  id: ID
  documentId: ID
  content: string
  section?: string | null
  tokenCount: number
  chunkIndex: number
  startOffset?: number | null
  endOffset?: number | null
  metadata?: unknown | null
  createdAt: Date
}

export interface CreateChunkDto {
  documentId: ID
  content: string
  chunkIndex: number
  section?: string
  startOffset?: number
  endOffset?: number
  metadata?: Record<string, unknown>
}
