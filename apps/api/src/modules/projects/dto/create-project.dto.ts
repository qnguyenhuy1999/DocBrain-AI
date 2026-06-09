import { CreateProjectSchema } from '@docbrain/validators'

export class CreateProjectDto {
  name!: string
  rootUrl!: string
  description?: string
}

export function parseCreateProjectDto(input: unknown): CreateProjectDto {
  return CreateProjectSchema.parse(input ?? {})
}
