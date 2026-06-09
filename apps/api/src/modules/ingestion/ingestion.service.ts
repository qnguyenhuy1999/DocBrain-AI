import { Injectable, Logger } from '@nestjs/common'
import { IndexerService } from './services/indexer.service'

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name)

  constructor(private readonly indexerService: IndexerService) {}

  queueProjectIndex(projectId: string, maxPages: number): void {
    void this.indexerService.indexProject(projectId, maxPages).catch((error: unknown) => {
      this.logger.error(
        `Project indexing failed for ${projectId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      )
    })
  }
}
