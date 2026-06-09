import { z } from 'zod'

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  rootUrl: z.string().url('Must be a valid URL'),
  description: z.string().max(500).optional(),
})

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export const IndexProjectSchema = z.object({
  maxPages: z.number().int().min(1).max(100).optional().default(30),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type IndexProjectInput = z.infer<typeof IndexProjectSchema>
