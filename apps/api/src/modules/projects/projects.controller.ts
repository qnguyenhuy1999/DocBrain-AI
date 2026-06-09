import type { ProjectOverview } from '@docbrain/types'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { parseCreateProjectDto } from './dto/create-project.dto'
import { parseUpdateProjectDto } from './dto/update-project.dto'
import { ProjectsService } from './projects.service'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() body?: unknown): Promise<ProjectOverview> {
    const input = parseCreateProjectDto(body)
    return this.projectsService.createProject(input)
  }

  @Get()
  async listProjects(): Promise<ProjectOverview[]> {
    return this.projectsService.listProjects()
  }

  @Get(':projectId')
  async getProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<ProjectOverview> {
    return this.projectsService.getProject(projectId)
  }

  @Patch(':projectId')
  async updateProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() body?: unknown,
  ): Promise<ProjectOverview> {
    const input = parseUpdateProjectDto(body)
    return this.projectsService.updateProject(projectId, input)
  }

  @Post(':projectId/archive')
  async archiveProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<ProjectOverview> {
    return this.projectsService.archiveProject(projectId)
  }
}
