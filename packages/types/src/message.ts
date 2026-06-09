import type { ID } from './common'

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'

export interface Citation {
  chunkId: ID
  documentId: ID
  title: string
  sourceUrl?: string | null
  section?: string | null
  score: number
}

export interface Message {
  id: ID
  conversationId: ID
  role: MessageRole
  content: string
  citations?: Citation[]
  createdAt: Date
}

export interface CreateMessageDto {
  conversationId: ID
  role: MessageRole
  content: string
  citations?: Citation[]
}

export interface ChatResponse {
  conversationId: ID
  userMessage: Message
  assistantMessage: Message
}
