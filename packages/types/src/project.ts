import type { ID, Timestamps } from './common'

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED'

export interface Project extends Timestamps {
  id: ID
  name: string
  rootUrl?: string | null
  status: ProjectStatus
  description?: string | null
}

export interface CreateProjectDto {
  name: string
  rootUrl: string
  description?: string
}

export interface UpdateProjectDto {
  name?: string
  rootUrl?: string
  description?: string
  status?: ProjectStatus
}

export interface IndexProjectDto {
  maxPages?: number
}

export interface ProjectOverview extends Project {
  documentCount: number
  readyCount: number
  failedCount: number
  processingCount: number
  pendingCount: number
  lastIndexedAt?: Date | null
}

export interface ProjectIndexSummary {
  totalDiscovered: number
  indexedCount: number
  skippedCount: number
  failedCount: number
}

export interface IndexProjectResponse {
  projectId: ID
  status: 'STARTED' | 'ALREADY_RUNNING'
}
