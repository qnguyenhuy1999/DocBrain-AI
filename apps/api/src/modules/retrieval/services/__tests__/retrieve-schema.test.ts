import { RetrieveSchema } from '@docbrain/validators'
import { describe, expect, it } from 'vitest'

describe('RetrieveSchema', () => {
  it('applies the default topK', () => {
    expect(RetrieveSchema.parse({ query: 'hello' })).toEqual({
      query: 'hello',
      topK: 5,
    })
  })

  it('rejects invalid topK values', () => {
    expect(() => RetrieveSchema.parse({ query: 'hello', topK: 0 })).toThrow()
    expect(() => RetrieveSchema.parse({ query: 'hello', topK: 21 })).toThrow()
  })
})
