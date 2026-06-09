'use client'

import type { Message } from '@docbrain/types'
import { useEffect, useRef } from 'react'
import { CitationList } from './citation-list'

function LoadingDots() {
  return (
    <div className="flex gap-1 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
    </div>
  )
}

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isAssistant = message.role === 'ASSISTANT'
        const isEmpty = isAssistant && message.content === ''
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
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {isEmpty ? <LoadingDots /> : message.content}
            </div>
            {isAssistant && !isEmpty && message.citations ? <CitationList citations={message.citations} /> : null}
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
