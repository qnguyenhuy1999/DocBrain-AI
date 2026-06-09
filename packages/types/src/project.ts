import type { ID, Timestamps } from './common'

export type ProjectStatus = 'active' | 'crawling' | 'error' | 'archived'

export interface Project extends Timestamps {
  id: ID
  name: string
  rootUrl: string
  status: ProjectStatus
  description?: string
}

export interface CreateProjectDto { name: string; rootUrl: string; description?: string }
export interface UpdateProjectDto { name?: string; description?: string; status?: ProjectStatus }
