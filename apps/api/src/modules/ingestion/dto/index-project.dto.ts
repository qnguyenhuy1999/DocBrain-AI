import { IndexProjectSchema } from '@docbrain/validators'

export class IndexProjectDto {
  maxPages?: number
}

export function parseIndexProjectDto(input: unknown): IndexProjectDto {
  return IndexProjectSchema.parse(input ?? {})
}
