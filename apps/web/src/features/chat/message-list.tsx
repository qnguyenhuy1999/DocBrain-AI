'use client'

import type { Message } from '@docbrain/types'
import { CitationList } from './citation-list'

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isAssistant = message.role === 'ASSISTANT'
        return (
          <div
            key={message.id}
            className={
              isAssistant
                ? 'mr-10 rounded-3xl bg-white p-4 shadow-sm'
                : 'ml-10 rounded-3xl bg-slate-950 p-4 text-white shadow-sm'
            }
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{message.role}</p>
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.content}</div>
            {isAssistant && message.citations ? <CitationList citations={message.citations} /> : null}
          </div>
        )
      })}
    </div>
  )
}
