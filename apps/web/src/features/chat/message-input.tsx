'use client'

import { useState } from 'react'

export function MessageInput({
  onSend,
  isPending,
}: {
  onSend: (message: string) => Promise<void>
  isPending: boolean
}) {
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = message.trim()
    if (!normalized) return
    setMessage('')
    await onSend(normalized)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      void handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <form className="flex gap-2 items-end" onSubmit={(event) => void handleSubmit(event)}>
      <textarea
        disabled={isPending}
        placeholder="Ask a question… (⌘↵ to send)"
        value={message}
        rows={1}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--input)',
          color: 'var(--foreground)',
          minHeight: '38px',
          maxHeight: '120px',
        }}
      />
      <button
        type="submit"
        disabled={isPending || !message.trim()}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors disabled:opacity-50 shrink-0"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        {isPending ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
