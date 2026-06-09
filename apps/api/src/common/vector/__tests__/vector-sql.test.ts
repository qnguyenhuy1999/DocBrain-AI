import { EMBEDDING_DIMENSIONS } from '@docbrain/config'
import { describe, expect, it } from 'vitest'
import { assertVectorDimension, toVectorLiteral } from '../vector-sql'

describe('vector-sql', () => {
  it('serializes a vector literal with fixed precision', () => {
    const vector = Array.from({ length: EMBEDDING_DIMENSIONS }, (_, index) => index / 10)
    const literal = toVectorLiteral(vector)

    expect(literal.startsWith('[0.00000000,0.10000000')).toBe(true)
    expect(literal.endsWith('153.50000000]')).toBe(true)
  })

  it('rejects vectors with invalid dimensions', () => {
    expect(() => assertVectorDimension([1, 2, 3])).toThrow(/expected 1536/)
  })

  it('rejects vectors with non-finite values', () => {
    const vector = Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0)
    vector[10] = Number.NaN

    expect(() => toVectorLiteral(vector)).toThrow(/non-finite/)
  })
})
