import 'reflect-metadata'
import { validateEnv } from '@docbrain/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './modules/app.module'

validateEnv()

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )
  app.enableCors()
  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3001
  await app.listen(port)
  console.warn(`API running on http://localhost:${port}`)
}

bootstrap()
