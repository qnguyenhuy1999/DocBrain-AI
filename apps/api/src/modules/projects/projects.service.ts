import type { ProjectOverview, UpdateProjectDto } from '@docbrain/types'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'

type ProjectRecord = {
  id: string
  name: string
  description: string | null
  rootUrl: string | null
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
}

type ProjectMetrics = {
  documentCount: number
  readyCount: number
  failedCount: number
  processingCount: number
  pendingCount: number
  lastIndexedAt: Date | null
}

@Injectable()
export class ProjectsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createProject(input: {
    name: string
    rootUrl: string
    description?: string
  }): Promise<ProjectOverview> {
    const project = await this.prisma.project.create({
      data: {
        name: input.name,
        rootUrl: input.rootUrl,
        description: input.description?.trim() || null,
      },
    })

    return this.buildProjectOverview(project, emptyMetrics())
  }

  async listProjects(): Promise<ProjectOverview[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })

    const metricsByProjectId = await this.getMetricsByProjectIds(projects.map((project) => project.id))

    return projects.map((project) =>
      this.buildProjectOverview(project, metricsByProjectId.get(project.id) ?? emptyMetrics()),
    )
  }

  async getProject(projectId: string): Promise<ProjectOverview> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }

    const metrics = await this.getMetricsForProject(projectId)
    return this.buildProjectOverview(project, metrics)
  }

  async updateProject(projectId: string, input: UpdateProjectDto): Promise<ProjectOverview> {
    await this.assertProjectExists(projectId)

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.rootUrl !== undefined ? { rootUrl: input.rootUrl } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
    })

    const metrics = await this.getMetricsForProject(projectId)
    return this.buildProjectOverview(project, metrics)
  }

  async archiveProject(projectId: string): Promise<ProjectOverview> {
    return this.updateProject(projectId, { status: 'ARCHIVED' })
  }

  private async assertProjectExists(projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }
  }

  private async getMetricsForProject(projectId: string): Promise<ProjectMetrics> {
    const [statusCounts, aggregate] = await Promise.all([
      this.prisma.document.groupBy({
        by: ['status'],
        where: { projectId },
        _count: { _all: true },
      }),
      this.prisma.document.aggregate({
        where: { projectId },
        _count: { _all: true },
        _max: { indexedAt: true },
      }),
    ])

    return buildMetrics(statusCounts, aggregate._count._all, aggregate._max.indexedAt)
  }

  private async getMetricsByProjectIds(projectIds: string[]): Promise<Map<string, ProjectMetrics>> {
    const metricsByProjectId = new Map<string, ProjectMetrics>()

    if (projectIds.length === 0) {
      return metricsByProjectId
    }

    const [statusCounts, aggregates] = await Promise.all([
      this.prisma.document.groupBy({
        by: ['projectId', 'status'],
        where: { projectId: { in: projectIds } },
        _count: { _all: true },
      }),
      this.prisma.document.groupBy({
        by: ['projectId'],
        where: { projectId: { in: projectIds } },
        _count: { _all: true },
        _max: { indexedAt: true },
      }),
    ])

    for (const aggregate of aggregates) {
      metricsByProjectId.set(
        aggregate.projectId,
        buildMetrics(
          statusCounts.filter((count) => count.projectId === aggregate.projectId),
          aggregate._count._all,
          aggregate._max.indexedAt,
        ),
      )
    }

    return metricsByProjectId
  }

  private buildProjectOverview(project: ProjectRecord, metrics: ProjectMetrics): ProjectOverview {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      rootUrl: project.rootUrl,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      documentCount: metrics.documentCount,
      readyCount: metrics.readyCount,
      failedCount: metrics.failedCount,
      processingCount: metrics.processingCount,
      pendingCount: metrics.pendingCount,
      lastIndexedAt: metrics.lastIndexedAt,
    }
  }
}

function emptyMetrics(): ProjectMetrics {
  return {
    documentCount: 0,
    readyCount: 0,
    failedCount: 0,
    processingCount: 0,
    pendingCount: 0,
    lastIndexedAt: null,
  }
}

function buildMetrics(
  statusCounts: Array<{
    status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'
    _count: { _all: number }
  }>,
  documentCount: number,
  lastIndexedAt: Date | null,
): ProjectMetrics {
  const metrics = emptyMetrics()
  metrics.documentCount = documentCount
  metrics.lastIndexedAt = lastIndexedAt

  for (const statusCount of statusCounts) {
    if (statusCount.status === 'READY') {
      metrics.readyCount = statusCount._count._all
    }
    if (statusCount.status === 'FAILED') {
      metrics.failedCount = statusCount._count._all
    }
    if (statusCount.status === 'PROCESSING') {
      metrics.processingCount = statusCount._count._all
    }
    if (statusCount.status === 'PENDING') {
      metrics.pendingCount = statusCount._count._all
    }
  }

  return metrics
}
