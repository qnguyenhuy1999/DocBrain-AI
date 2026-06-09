import { z } from 'zod'

export const RetrieveSchema = z.object({
  query: z.string().trim().min(1).max(2000),
  topK: z.number().int().min(1).max(20).optional().default(5),
  minScore: z.number().min(0).max(1).optional(),
})

export type RetrieveInput = z.infer<typeof RetrieveSchema>
