import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { IngestionController } from './ingestion.controller'
import { IngestionService } from './ingestion.service'
import { ChunkerService } from './services/chunker.service'
import { ContentExtractorService } from './services/content-extractor.service'
import { CrawlerService } from './services/crawler.service'
import { EmbeddingService } from './services/embedding.service'
import { IndexerService } from './services/indexer.service'
import { LinkDiscoveryService } from './services/link-discovery.service'
import { MarkdownConverterService } from './services/markdown-converter.service'
import { SitemapDiscoveryService } from './services/sitemap-discovery.service'

@Module({
  imports: [DatabaseModule],
  controllers: [IngestionController],
  providers: [
    IngestionService,
    SitemapDiscoveryService,
    LinkDiscoveryService,
    CrawlerService,
    ContentExtractorService,
    MarkdownConverterService,
    ChunkerService,
    EmbeddingService,
    IndexerService,
  ],
})
export class IngestionModule {}
