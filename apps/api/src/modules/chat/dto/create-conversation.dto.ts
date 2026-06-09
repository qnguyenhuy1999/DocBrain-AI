import { CreateConversationSchema } from '@docbrain/validators'

export class CreateConversationDto {
  title?: string
}

export function parseCreateConversationDto(input: unknown): CreateConversationDto {
  return CreateConversationSchema.parse(input ?? {})
}
