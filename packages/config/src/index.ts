import { z } from 'zod'

export const EMBEDDING_MODEL = 'text-embedding-3-small' as const
export const DEFAULT_EMBEDDING_DIMENSIONS = 3072 as const
export const EMBEDDING_DIMENSIONS = z.coerce
  .number()
  .int()
  .positive()
  .parse(process.env.OPENAI_EMBEDDING_DIMENSIONS ?? DEFAULT_EMBEDDING_DIMENSIONS)
export const EMBEDDING_BATCH_SIZE = 20 as const
export const MIN_EXTRACTED_TEXT_LENGTH = 50 as const
export const CHAT_MODEL = 'cx/gpt-5.4-mini' as const
export const CHAT_TEMPERATURE = 0.2 as const
export const CHAT_MAX_OUTPUT_TOKENS = 1200 as const
export const RAG_TOP_K = 5 as const
export const MIN_RETRIEVAL_SCORE = 0.35 as const

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  OPENAI_BASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_EMBEDDING_BASE_URL: z.string().min(1),
  OPENAI_EMBEDDING_API_KEY: z.string().min(1),
  OPENAI_EMBEDDING_DIMENSIONS: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_EMBEDDING_DIMENSIONS),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().default(3001),
  WEB_PORT: z.coerce.number().default(3000),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(env: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(env)
  if (!result.success) {
    const missing = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    throw new Error(`Invalid environment variables:\n${missing.join('\n')}`)
  }
  return result.data
}

export { envSchema }
