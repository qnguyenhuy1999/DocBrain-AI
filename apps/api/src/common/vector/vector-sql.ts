import { EMBEDDING_DIMENSIONS } from '@docbrain/config'
import { Prisma } from '@prisma/client'

export function assertVectorDimension(
  vector: number[],
  expectedDimensions = EMBEDDING_DIMENSIONS,
): void {
  if (vector.length !== expectedDimensions) {
    throw new Error(
      `Vector dimension mismatch: expected ${expectedDimensions}, received ${vector.length}`,
    )
  }

  if (!vector.every((value) => Number.isFinite(value))) {
    throw new Error('Vector contains non-finite values')
  }
}

export function toVectorLiteral(vector: number[]): string {
  assertVectorDimension(vector)
  return `[${vector.map((value) => Number(value).toFixed(8)).join(',')}]`
}

export function toVectorSql(vector: number[]): Prisma.Sql {
  return Prisma.sql`CAST(${toVectorLiteral(vector)} AS vector)`
}
