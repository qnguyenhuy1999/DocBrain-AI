import type { ID, Timestamps } from './common'

export interface Chunk extends Timestamps {
  id: ID; documentId: ID; projectId: ID; content: string
  embedding: number[]; tokenCount: number; chunkIndex: number
  metadata: Record<string, unknown>
}
export interface CreateChunkDto {
  documentId: ID; projectId: ID; content: string
  chunkIndex: number; metadata?: Record<string, unknown>
}
