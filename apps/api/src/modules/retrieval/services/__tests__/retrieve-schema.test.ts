import { RetrieveSchema } from '@docbrain/validators'
import { describe, expect, it } from 'vitest'

describe('RetrieveSchema', () => {
  it('applies the default topK', () => {
    expect(RetrieveSchema.parse({ query: 'hello' })).toEqual({
      query: 'hello',
      topK: 5,
    })
  })

  it('trims the query and preserves minScore', () => {
    expect(RetrieveSchema.parse({ query: '  hello  ', minScore: 0.4 })).toEqual({
      query: 'hello',
      topK: 5,
      minScore: 0.4,
    })
  })

  it('rejects invalid topK values', () => {
    expect(() => RetrieveSchema.parse({ query: 'hello', topK: 0 })).toThrow()
    expect(() => RetrieveSchema.parse({ query: 'hello', topK: 21 })).toThrow()
  })

  it('rejects invalid minScore values', () => {
    expect(() => RetrieveSchema.parse({ query: 'hello', minScore: -0.1 })).toThrow()
    expect(() => RetrieveSchema.parse({ query: 'hello', minScore: 1.1 })).toThrow()
  })
})
