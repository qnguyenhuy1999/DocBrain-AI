import { z } from 'zod'

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  rootUrl: z.string().trim().url('Must be a valid URL'),
  description: z.string().trim().max(500).optional(),
})

export const UpdateProjectSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  rootUrl: z.string().trim().url('Must be a valid URL').optional(),
  description: z.string().trim().max(500).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export const IndexProjectSchema = z.object({
  maxPages: z.number().int().min(1).max(100).optional().default(30),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type IndexProjectInput = z.infer<typeof IndexProjectSchema>
