import type { ID, Timestamps } from './common'

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'
export type DocumentSourceType = 'URL' | 'FILE' | 'MANUAL'

export interface Document extends Timestamps {
  id: ID
  projectId: ID
  title: string
  sourceType: DocumentSourceType
  sourceUrl?: string | null
  markdown?: string | null
  contentHash?: string | null
  status: DocumentStatus
  errorMessage?: string | null
  indexedAt?: Date | null
}

export interface CreateDocumentDto {
  projectId: ID
  title: string
  sourceType: DocumentSourceType
  sourceUrl?: string
  markdown?: string
}
