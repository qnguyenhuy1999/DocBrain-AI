'use client'

import { Button, Textarea } from '@docbrain/ui'
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
    if (!normalized) {
      return
    }

    setMessage('')
    await onSend(normalized)
  }

  return (
    <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
      <Textarea
        placeholder="Ask a question about the indexed documentation"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Sending...' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
