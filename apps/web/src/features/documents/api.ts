'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const documentKeys = {
  all: ['documents'] as const,
  list: (projectId: string) => [...documentKeys.all, 'list', projectId] as const,
  chunks: (projectId: string, documentId?: string) =>
    [...documentKeys.all, 'chunks', projectId, documentId ?? 'all'] as const,
}

export function useDocuments(projectId: string, refetchInterval?: number | false) {
  return useQuery({
    queryKey: documentKeys.list(projectId),
    queryFn: () => apiClient.listDocuments(projectId),
    enabled: Boolean(projectId),
    refetchInterval,
  })
}

export function useChunks(projectId: string, documentId?: string) {
  return useQuery({
    queryKey: documentKeys.chunks(projectId, documentId),
    queryFn: () => apiClient.listChunks(projectId, documentId),
    enabled: Boolean(projectId),
  })
}
