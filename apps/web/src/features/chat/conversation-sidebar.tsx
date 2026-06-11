'use client'

import type { Conversation } from '@docbrain/types'
import { formatDate, truncate } from '@/lib/format'

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  isCreatingConversation,
}: {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
  onCreateConversation: () => void
  isCreatingConversation: boolean
}) {
  return (
    <div className="rounded-lg border flex flex-col overflow-hidden" style={{ background: 'var(--card)' }}>
      <div className="p-4 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Conversations</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Create a thread or pick one.</p>
        </div>
        <button
          type="button"
          disabled={isCreatingConversation}
          onClick={onCreateConversation}
          className="inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-3 transition-colors disabled:opacity-50"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {isCreatingConversation ? '…' : 'New'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="rounded-md border border-dashed px-3 py-4 text-sm text-center" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
            No conversations yet
          </p>
        ) : null}
        {conversations.map((conversation) => {
          const active = conversation.id === selectedConversationId
          return (
            <button
              key={conversation.id}
              className="block w-full rounded-md px-3 py-2.5 text-left transition-colors"
              style={active
                ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                : { color: 'var(--foreground)' }
              }
              onClick={() => onSelectConversation(conversation.id)}
              type="button"
            >
              <p className="text-sm font-medium leading-snug">
                {truncate(conversation.title || 'Untitled conversation', 38)}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)', opacity: active ? 0.75 : 1 }}>
                {formatDate(conversation.updatedAt)}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
