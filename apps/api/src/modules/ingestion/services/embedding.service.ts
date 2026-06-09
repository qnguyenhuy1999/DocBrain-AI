import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { EMBEDDING_BATCH_SIZE, EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from '@docbrain/config'
import { Prisma } from '@prisma/client'
import OpenAI from 'openai'
import { toVectorSql } from '../../../common/vector/vector-sql'

@Injectable()
export class EmbeddingService {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = []

    for (let index = 0; index < texts.length; index += EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(index, index + EMBEDDING_BATCH_SIZE)
      const response = await this.client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      })

      for (const item of response.data) {
        embeddings.push(item.embedding)
      }
    }

    return embeddings
  }

  async embedQuery(query: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
      dimensions: EMBEDDING_DIMENSIONS,
    })

    const embedding = response.data[0]?.embedding
    if (!embedding) {
      throw new Error('Embedding response did not include a query vector')
    }

    return embedding
  }

  async storeEmbeddings(
    prisma: Prisma.TransactionClient,
    records: Array<{ chunkId: string; vector: number[] }>,
  ): Promise<void> {
    for (const record of records) {
      await prisma.$executeRaw(
        Prisma.sql`
          INSERT INTO "embeddings" ("id", "chunkId", "model", "vector", "createdAt")
          VALUES (
            ${randomUUID()},
            ${record.chunkId},
            ${EMBEDDING_MODEL},
            ${toVectorSql(record.vector)},
            NOW()
          )
          ON CONFLICT ("chunkId")
          DO UPDATE
          SET "model" = EXCLUDED."model",
              "vector" = EXCLUDED."vector",
              "createdAt" = NOW()
        `,
      )
    }
  }
}
