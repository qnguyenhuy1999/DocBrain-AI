'use client'

import type { Conversation } from '@docbrain/types'
import { Button } from '@docbrain/ui'
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
    <div className="rounded-3xl border border-white/60 bg-white/85 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">Conversations</p>
          <p className="text-xs text-slate-600">Create a thread or reopen an existing one.</p>
        </div>
        <Button disabled={isCreatingConversation} onClick={onCreateConversation} size="sm">
          New conversation
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {conversations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
            No conversations yet
          </p>
        ) : null}
        {conversations.map((conversation) => {
          const active = conversation.id === selectedConversationId
          return (
            <button
              key={conversation.id}
              className={
                active
                  ? 'block w-full rounded-2xl bg-slate-950 px-3 py-3 text-left text-white'
                  : 'block w-full rounded-2xl bg-amber-50/70 px-3 py-3 text-left text-slate-900 hover:bg-amber-100'
              }
              onClick={() => onSelectConversation(conversation.id)}
              type="button"
            >
              <p className="text-sm font-medium">
                {truncate(conversation.title || 'Untitled conversation', 42)}
              </p>
              <p className={active ? 'mt-1 text-xs text-white/70' : 'mt-1 text-xs text-slate-500'}>
                {formatDate(conversation.updatedAt)}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
