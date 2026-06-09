import type { ID, Timestamps } from './common'

export type DocumentStatus = 'pending' | 'processing' | 'indexed' | 'error'

export interface Document extends Timestamps {
  id: ID; projectId: ID; url: string; title: string; content: string
  status: DocumentStatus; checksum: string
}
export interface CreateDocumentDto { projectId: ID; url: string; title: string; content: string }
