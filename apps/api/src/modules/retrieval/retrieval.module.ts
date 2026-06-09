import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { IngestionModule } from '../ingestion/ingestion.module'
import { RetrievalController } from './retrieval.controller'
import { RetrievalService } from './retrieval.service'
import { RetrievalFormatterService } from './services/retrieval-formatter.service'
import { VectorSearchService } from './services/vector-search.service'

@Module({
  imports: [DatabaseModule, IngestionModule],
  controllers: [RetrievalController],
  providers: [RetrievalService, VectorSearchService, RetrievalFormatterService],
})
export class RetrievalModule {}
