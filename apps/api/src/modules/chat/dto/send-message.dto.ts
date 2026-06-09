import { SendMessageSchema } from '@docbrain/validators'

export class SendMessageDto {
  message!: string
}

export function parseSendMessageDto(input: unknown): SendMessageDto {
  return SendMessageSchema.parse(input ?? {})
}
