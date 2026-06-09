import { RetrieveSchema } from '@docbrain/validators'

export class RetrieveDto {
  query!: string
  topK?: number
}

export function parseRetrieveDto(input: unknown): RetrieveDto {
  return RetrieveSchema.parse(input ?? {})
}
