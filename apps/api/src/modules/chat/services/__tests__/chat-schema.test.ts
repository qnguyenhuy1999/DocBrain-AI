import { CreateConversationSchema, SendMessageSchema } from '@docbrain/validators'
import { describe, expect, it } from 'vitest'

describe('chat schemas', () => {
  it('accepts an optional trimmed conversation title', () => {
    expect(CreateConversationSchema.parse({ title: '  Getting started  ' })).toEqual({
      title: 'Getting started',
    })
  })

  it('accepts a trimmed send-message body', () => {
    expect(SendMessageSchema.parse({ message: '  Hello docs  ' })).toEqual({
      message: 'Hello docs',
    })
  })

  it('rejects empty messages and empty titles', () => {
    expect(() => SendMessageSchema.parse({ message: '   ' })).toThrow()
    expect(() => CreateConversationSchema.parse({ title: '   ' })).toThrow()
  })
})
