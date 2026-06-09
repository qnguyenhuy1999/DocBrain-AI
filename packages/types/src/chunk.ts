import type { ID, Timestamps } from './common'

export interface Chunk extends Timestamps {
  id: ID
  documentId: ID
  content: string
  section?: string | null
  tokenCount: number
  chunkIndex: number
  startOffset?: number | null
  endOffset?: number | null
  metadata?: Record<string, unknown> | null
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
