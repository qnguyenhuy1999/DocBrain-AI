'use client'

import type { Message } from '@docbrain/types'
import { useEffect, useRef } from 'react'
import { CitationList } from './citation-list'

function LoadingDots() {
  return (
    <div className="flex gap-1.5 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" style={{ background: 'var(--muted-foreground)' }} />
      <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" style={{ background: 'var(--muted-foreground)' }} />
      <span className="h-2 w-2 animate-bounce rounded-full" style={{ background: 'var(--muted-foreground)' }} />
    </div>
  )
}

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isAssistant = message.role === 'ASSISTANT'
        const isEmpty = isAssistant && message.content === ''
        return (
          <div
            key={message.id}
            className={isAssistant ? 'mr-10' : 'ml-10'}
          >
            <div
              className="rounded-2xl px-4 py-3"
              style={isAssistant
                ? {
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }
                : {
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }
              }
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                style={{ opacity: 0.5 }}
              >
                {message.role}
              </p>
              <div className="whitespace-pre-wrap text-sm leading-6">
                {isEmpty ? <LoadingDots /> : message.content}
              </div>
            </div>
            {isAssistant && !isEmpty && message.citations ? (
              <CitationList citations={message.citations} />
            ) : null}
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
