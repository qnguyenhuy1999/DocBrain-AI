'use client'

import type { Message } from '@docbrain/types'
import { useEffect, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import {
  useConversations,
  useCreateConversation,
  useMessages,
  useSendMessage,
} from '@/features/chat/api'
import { useProject } from '@/features/projects/api'
import { ConversationSidebar } from '@/features/chat/conversation-sidebar'
import { MessageInput } from '@/features/chat/message-input'
import { MessageList } from '@/features/chat/message-list'
import { use } from 'react'

export default function ProjectChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined)
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
  const { projectId } = use(params)
  const project = useProject(projectId)
  const conversations = useConversations(projectId)
  const createConversation = useCreateConversation(projectId)
  const messages = useMessages(selectedConversationId)
  const sendMessage = useSendMessage(projectId)

  useEffect(() => {
    if (!selectedConversationId && conversations.data?.[0]?.id) {
      setSelectedConversationId(conversations.data[0].id)
    }
  }, [conversations.data, selectedConversationId])

  async function handleCreateConversation() {
    const conversation = await createConversation.mutateAsync({})
    setSelectedConversationId(conversation.id)
  }

  async function handleSend(message: string) {
    let conversationId = selectedConversationId

    if (!conversationId) {
      const conversation = await createConversation.mutateAsync({})
      conversationId = conversation.id
      setSelectedConversationId(conversation.id)
    }

    const now = new Date()
    setOptimisticMessages([
      { id: 'optimistic-user', role: 'USER', content: message, citations: [], createdAt: now, conversationId: conversationId },
      { id: 'optimistic-assistant', role: 'ASSISTANT', content: '', citations: [], createdAt: now, conversationId: conversationId },
    ])

    try {
      await sendMessage.mutateAsync({
        conversationId,
        message: { message },
      })
    } finally {
      setOptimisticMessages([])
    }
  }

  if (conversations.isLoading) {
    return (
      <AppShell projectId={projectId} projectName={project.data?.name}>
        <LoadingState title="Loading conversations" description="Fetching existing threads for this project." />
      </AppShell>
    )
  }

  if (conversations.error) {
    return (
      <AppShell projectId={projectId} projectName={project.data?.name}>
        <ErrorState title="Could not load conversations" message={conversations.error.message} />
      </AppShell>
    )
  }

  const realMessages: Message[] = messages.data ?? []
  const displayMessages: Message[] = [...realMessages, ...optimisticMessages]

  return (
    <AppShell
      projectId={projectId}
      projectName={project.data?.name}
    >
      <section className="container py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Chat with docs</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Ask questions, get cited answers.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[260px_1fr]" style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}>
          <ConversationSidebar
            conversations={conversations.data ?? []}
            isCreatingConversation={createConversation.isPending}
            onCreateConversation={() => void handleCreateConversation()}
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
          />
          <div className="rounded-lg border flex flex-col h-full overflow-hidden" style={{ background: 'var(--card)' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.error ? <ErrorState title="Could not load messages" message={messages.error.message} /> : null}
              {displayMessages.length === 0 ? (
                <div className="h-full grid place-items-center text-center" style={{ color: 'var(--muted-foreground)' }}>
                  <div className="max-w-sm">
                    <div className="font-medium" style={{ color: 'var(--foreground)' }}>Start a conversation</div>
                    <p className="text-sm mt-1">Ask anything about the indexed documentation.</p>
                  </div>
                </div>
              ) : (
                <MessageList messages={displayMessages} />
              )}
            </div>
            {sendMessage.error ? (
              <div className="px-4 pb-2">
                <ErrorState title="AI generation failed" message={sendMessage.error.message} />
              </div>
            ) : null}
            <div className="border-t p-3">
              <MessageInput isPending={sendMessage.isPending} onSend={handleSend} />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
