import { z } from 'zod'

export const CreateDocumentSchema = z.object({
  projectId: z.string().uuid(),
  url: z.string().url(),
  title: z.string().min(1).max(500),
  content: z.string().min(1),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>
