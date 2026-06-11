'use client'

import type { Chunk } from '@docbrain/types'
import { useState } from 'react'

const PREVIEW_LENGTH = 240

function ChunkCard({ chunk }: { chunk: Chunk }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const isLong = chunk.content.length > PREVIEW_LENGTH
  const displayContent = expanded || !isLong ? chunk.content : `${chunk.content.slice(0, PREVIEW_LENGTH)}...`

  function handleCopy() {
    void navigator.clipboard.writeText(chunk.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="rounded-lg border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="font-semibold" style={{ color: 'var(--secondary)' }}>#{chunk.chunkIndex}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>{chunk.section || 'Untitled section'}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>{chunk.tokenCount} tokens</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border px-2 py-1 text-xs font-medium transition-colors"
          style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-sm leading-6 whitespace-pre-wrap break-words" style={{ color: 'var(--foreground)' }}>{displayContent}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium hover:underline"
          style={{ color: 'var(--secondary)' }}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  )
}

export function ChunkList({ chunks }: { chunks: Chunk[] }) {
  return (
    <div className="space-y-3">
      {chunks.map((chunk) => (
        <ChunkCard key={chunk.id} chunk={chunk} />
      ))}
    </div>
  )
}
