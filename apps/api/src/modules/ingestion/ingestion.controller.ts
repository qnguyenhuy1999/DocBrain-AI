import type { Chunk, Document, IndexProjectResponse } from '@docbrain/types'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'
import { parseIndexProjectDto } from './dto/index-project.dto'
import { IngestionService } from './ingestion.service'

@Controller('projects')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(':projectId/index')
  async indexProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() body?: unknown,
  ): Promise<IndexProjectResponse> {
    const input = parseIndexProjectDto(body)
    return this.ingestionService.indexProject(projectId, input.maxPages ?? 30)
  }

  @Get(':projectId/documents')
  getDocuments(@Param('projectId', new ParseUUIDPipe()) projectId: string): Promise<Document[]> {
    return this.ingestionService.getProjectDocuments(projectId)
  }

  @Get(':projectId/chunks')
  getChunks(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Query('documentId') documentId?: string,
  ): Promise<Chunk[]> {
    return this.ingestionService.getProjectChunks(projectId, documentId)
  }
}
