import type { IndexProjectResponse } from '@docbrain/types'
import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { parseIndexProjectDto } from './dto/index-project.dto'
import { IngestionService } from './ingestion.service'

@Controller('projects')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(':projectId/index')
  indexProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() body?: unknown,
  ): IndexProjectResponse {
    const input = parseIndexProjectDto(body)
    this.ingestionService.queueProjectIndex(projectId, input.maxPages ?? 30)

    return {
      projectId,
      status: 'PROCESSING',
      queued: true,
    }
  }
}
