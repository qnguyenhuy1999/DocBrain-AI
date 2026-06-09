import type { ID, Timestamps } from './common'

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'

export interface MessageSource {
  chunkId: ID
  documentId: ID
  url: string
  title: string
  relevanceScore: number
}
export interface Message extends Timestamps {
  id: ID
  conversationId: ID
  role: MessageRole
  content: string
  sources?: MessageSource[]
}
export interface CreateMessageDto {
  conversationId: ID
  role: MessageRole
  content: string
  sources?: MessageSource[]
}
