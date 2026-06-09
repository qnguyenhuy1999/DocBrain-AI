import { UpdateProjectSchema } from '@docbrain/validators'

export class UpdateProjectDto {
  name?: string
  rootUrl?: string
  description?: string
  status?: 'ACTIVE' | 'ARCHIVED'
}

export function parseUpdateProjectDto(input: unknown): UpdateProjectDto {
  return UpdateProjectSchema.parse(input ?? {})
}
