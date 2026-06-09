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
  description?: string
  status?: ProjectStatus
}

export interface IndexProjectDto {
  maxPages?: number
}

export interface IndexProjectResponse {
  projectId: ID
  status: 'PROCESSING'
  queued: true
}
