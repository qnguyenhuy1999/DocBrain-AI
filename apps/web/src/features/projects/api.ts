'use client'

import type { ProjectOverview } from '@docbrain/types'
import type { CreateProjectInput, IndexProjectInput } from '@docbrain/validators'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (projectId: string) => [...projectKeys.all, 'detail', projectId] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => apiClient.listProjects(),
  })
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => apiClient.getProject(projectId),
    enabled: Boolean(projectId),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => apiClient.createProject(input),
    onSuccess: (project) => {
      queryClient.setQueryData<ProjectOverview>(projectKeys.detail(project.id), project)
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useIndexProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input?: IndexProjectInput) => apiClient.indexProject(projectId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
    },
  })
}

export function useArchiveProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.archiveProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
