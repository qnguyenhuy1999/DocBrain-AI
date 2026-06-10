import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { EMBEDDING_BATCH_SIZE, EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from '@docbrain/config'
import { Prisma } from '@prisma/client'
import OpenAI from 'openai'
import { toVectorSql } from '../../../common/vector/vector-sql'

type EmbeddingItem = {
  embedding?: number[]
}

type EmbeddingErrorPayload = {
  error?: {
    message?: string
    code?: number | string
  }
}

@Injectable()
export class EmbeddingService {
  private readonly client = new OpenAI({
    baseURL: process.env.OPENAI_EMBEDDING_BASE_URL,
    apiKey: process.env.OPENAI_EMBEDDING_API_KEY,
  })

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return []
    }

    const embeddings: number[][] = []

    for (let index = 0; index < texts.length; index += EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(index, index + EMBEDDING_BATCH_SIZE)
      const response = await this.client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      })

      for (const item of this.readEmbeddingItems(response)) {
        if (!Array.isArray(item.embedding)) {
          throw new Error('Embedding response item did not include a vector')
        }

        this.assertExpectedDimensions(item.embedding)
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

    const embedding = this.readEmbeddingItems(response)[0]?.embedding
    if (!embedding) {
      throw new Error('Embedding response did not include a query vector')
    }

    this.assertExpectedDimensions(embedding)
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

  private assertExpectedDimensions(vector: number[]): void {
    if (vector.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Embedding provider returned ${vector.length} dimensions for ${EMBEDDING_MODEL}; expected ${EMBEDDING_DIMENSIONS}. Check whether the provider honors the requested embedding size.`,
      )
    }
  }

  private readEmbeddingItems(response: unknown): EmbeddingItem[] {
    const providerError = this.readProviderError(response)
    if (providerError) {
      throw new Error(providerError)
    }

    if (
      typeof response !== 'object' ||
      response === null ||
      !('data' in response) ||
      !Array.isArray(response.data)
    ) {
      throw new Error('Embedding provider returned an unexpected payload shape')
    }

    return response.data as EmbeddingItem[]
  }

  private readProviderError(response: unknown): string | null {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('error' in response) ||
      typeof response.error !== 'object' ||
      response.error === null
    ) {
      return null
    }

    const error = response as EmbeddingErrorPayload
    const message = error.error?.message?.trim()
    if (!message) {
      return 'Embedding provider returned an unknown error'
    }

    const code = error.error?.code
    return code === undefined ? message : `${message} (code: ${code})`
  }
}
