import type { ID, Timestamps } from './common'

export interface Conversation extends Timestamps {
  id: ID; projectId: ID; title: string; messageCount: number
}
export interface CreateConversationDto { projectId: ID; title?: string }
