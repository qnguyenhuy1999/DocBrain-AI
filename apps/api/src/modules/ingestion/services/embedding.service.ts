import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import OpenAI from 'openai'

const EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDING_DIMENSIONS = 1536
const EMBEDDING_BATCH_SIZE = 20

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

  async storeEmbeddings(
    prisma: Prisma.TransactionClient,
    records: Array<{ chunkId: string; vector: number[] }>,
  ): Promise<void> {
    for (const record of records) {
      const vectorLiteral = `[${record.vector.map((value) => Number(value).toFixed(8)).join(',')}]`

      await prisma.$executeRaw(
        Prisma.sql`
          INSERT INTO "embeddings" ("id", "chunkId", "model", "vector", "createdAt")
          VALUES (
            ${randomUUID()},
            ${record.chunkId},
            ${EMBEDDING_MODEL},
            ${Prisma.raw(`'${vectorLiteral}'::vector`)},
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
