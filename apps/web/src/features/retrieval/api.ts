'use client'

import type { RetrieveInput } from '@docbrain/validators'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useRetrieve(projectId: string) {
  return useMutation({
    mutationFn: (input: RetrieveInput) => apiClient.retrieve(projectId, input),
  })
}
