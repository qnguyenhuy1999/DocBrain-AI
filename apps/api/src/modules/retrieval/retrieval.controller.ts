import type { RetrieveResponse } from '@docbrain/types'
import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { parseRetrieveDto } from './dto/retrieve.dto'
import { RetrievalService } from './retrieval.service'

@Controller('projects')
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post(':projectId/retrieve')
  async retrieve(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() body?: unknown,
  ): Promise<RetrieveResponse> {
    const input = parseRetrieveDto(body)
    return this.retrievalService.retrieve(projectId, input.query, {
      topK: input.topK,
      minScore: input.minScore,
    })
  }
}
