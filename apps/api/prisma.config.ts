import path from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .env.local from monorepo root (two levels up from apps/api)
config({ path: path.resolve(__dirname, '../../.env.local') })

export default defineConfig({
  schema: path.resolve(__dirname, '../../prisma/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: path.resolve(__dirname, '../../prisma/seed.ts'),
  },
})
