import { z } from 'zod'

export const CreateDocumentSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(500),
  sourceType: z.enum(['URL', 'FILE', 'MANUAL']),
  sourceUrl: z.string().url().optional(),
  markdown: z.string().min(1).optional(),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>
