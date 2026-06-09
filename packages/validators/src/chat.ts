import { z } from 'zod'

export const ChatSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(10000),
})

export const CreateConversationSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().max(200).optional(),
})

export type ChatInput = z.infer<typeof ChatSchema>
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>
