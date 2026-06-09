import { z } from 'zod'

export const RetrieveSchema = z.object({
  query: z.string().min(1).max(2000),
  topK: z.number().int().min(1).max(20).optional().default(5),
})

export type RetrieveInput = z.infer<typeof RetrieveSchema>
