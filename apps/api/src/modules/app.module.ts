import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { DatabaseModule } from './database/database.module'
import { IngestionModule } from './ingestion/ingestion.module'

@Module({ imports: [HealthModule, DatabaseModule, IngestionModule] })
export class AppModule {}
