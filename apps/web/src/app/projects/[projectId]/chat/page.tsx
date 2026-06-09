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

export default function ProjectChatPage({ params }: { params: { projectId: string } }) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined)
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
  const projectId = params.projectId
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
      <AppShell title="Chat" description="Grounded chat over indexed documentation." projectId={projectId} projectName={project.data?.name}>
        <LoadingState title="Loading conversations" description="Fetching existing threads for this project." />
      </AppShell>
    )
  }

  if (conversations.error) {
    return (
      <AppShell title="Chat" description="Grounded chat over indexed documentation." projectId={projectId} projectName={project.data?.name}>
        <ErrorState title="Could not load conversations" message={conversations.error.message} />
      </AppShell>
    )
  }

  const realMessages: Message[] = messages.data ?? []
  const displayMessages: Message[] = [...realMessages, ...optimisticMessages]

  return (
    <AppShell
      title="Chat with indexed docs"
      description="Messages stay grounded in retrieved chunks, and assistant replies expose citations under each answer."
      projectId={projectId}
      projectName={project.data?.name}
    >
      <div className="grid gap-6 overflow-x-hidden lg:grid-cols-[320px_minmax(0,1fr)]">
        <ConversationSidebar
          conversations={conversations.data ?? []}
          isCreatingConversation={createConversation.isPending}
          onCreateConversation={() => void handleCreateConversation()}
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
        <div className="min-w-0 rounded-3xl border border-white/60 bg-amber-50/60 p-4">
          {messages.error ? <ErrorState title="Could not load messages" message={messages.error.message} /> : null}
          {displayMessages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center">
              <p className="text-sm font-medium text-slate-700">Ask a question about this project's docs</p>
              <p className="mt-1 text-xs text-slate-500">Based on indexed documentation</p>
            </div>
          ) : (
            <MessageList messages={displayMessages} />
          )}
          {sendMessage.error ? (
            <div className="mt-4">
              <ErrorState title="AI generation failed" message={sendMessage.error.message} />
            </div>
          ) : null}
          <div className="mt-6">
            <MessageInput isPending={sendMessage.isPending} onSend={handleSend} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
