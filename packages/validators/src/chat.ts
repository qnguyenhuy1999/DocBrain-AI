import { z } from 'zod'

export const CreateConversationSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
})

export const SendMessageSchema = z.object({
  message: z.string().trim().min(1).max(10000),
})

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>
export type SendMessageInput = z.infer<typeof SendMessageSchema>
