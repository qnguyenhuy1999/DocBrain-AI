import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { DatabaseModule } from './database/database.module'
import { IngestionModule } from './ingestion/ingestion.module'
import { RetrievalModule } from './retrieval/retrieval.module'
import { ChatModule } from './chat/chat.module'

@Module({ imports: [HealthModule, DatabaseModule, IngestionModule, RetrievalModule, ChatModule] })
export class AppModule {}
