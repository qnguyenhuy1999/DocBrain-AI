'use client'

import type { ChatResponse, Conversation, Message } from '@docbrain/types'
import type { CreateConversationInput, SendMessageInput } from '@docbrain/validators'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const chatKeys = {
  all: ['chat'] as const,
  conversations: (projectId: string) => [...chatKeys.all, 'conversations', projectId] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
}

export function useConversations(projectId: string) {
  return useQuery({
    queryKey: chatKeys.conversations(projectId),
    queryFn: () => apiClient.listConversations(projectId),
    enabled: Boolean(projectId),
  })
}

export function useCreateConversation(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input?: CreateConversationInput) => apiClient.createConversation(projectId, input),
    onSuccess: (conversation) => {
      const current = queryClient.getQueryData<Conversation[]>(chatKeys.conversations(projectId)) ?? []
      queryClient.setQueryData<Conversation[]>(chatKeys.conversations(projectId), [conversation, ...current])
    },
  })
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId ?? 'none'),
    queryFn: () => apiClient.listMessages(conversationId as string),
    enabled: Boolean(conversationId),
  })
}

export function useSendMessage(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { conversationId: string; message: SendMessageInput }) =>
      apiClient.sendMessage(input.conversationId, input.message),
    onMutate: async ({ conversationId, message }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) })

      const previous = queryClient.getQueryData<Message[]>(chatKeys.messages(conversationId)) ?? []
      const optimisticUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        conversationId,
        role: 'USER',
        content: message.message,
        createdAt: new Date(),
      }
      const optimisticAssistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        conversationId,
        role: 'ASSISTANT',
        content: 'Thinking...',
        citations: [],
        createdAt: new Date(),
      }

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(conversationId),
        [...previous, optimisticUserMessage, optimisticAssistantMessage],
      )

      return { previous, conversationId }
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return
      }

      queryClient.setQueryData(chatKeys.messages(context.conversationId), context.previous)
    },
    onSuccess: (response: ChatResponse) => {
      queryClient.setQueryData<Message[]>(chatKeys.messages(response.conversationId), (current) => {
        const existing = current ?? []
        const filtered = existing.filter((message) => !message.id.startsWith('temp-'))
        return [...filtered, response.userMessage, response.assistantMessage]
      })
      void queryClient.invalidateQueries({ queryKey: chatKeys.conversations(projectId) })
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.conversationId) })
    },
  })
}
