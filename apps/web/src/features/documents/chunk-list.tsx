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
    <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-amber-700">#{chunk.chunkIndex}</span>
          <span className="text-slate-400">·</span>
          <span>{chunk.section || 'Untitled section'}</span>
          <span className="text-slate-400">·</span>
          <span>{chunk.tokenCount} tokens</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-700"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">{displayContent}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium text-amber-700 hover:underline"
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
