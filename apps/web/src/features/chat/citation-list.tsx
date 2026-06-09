'use client'

import type { Citation } from '@docbrain/types'
import Link from 'next/link'

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) {
    return null
  }

  return (
    <div className="mt-3 grid gap-2">
      {citations.map((citation, index) => (
        <div
          key={`${citation.chunkId}-${index}`}
          className="rounded-2xl border border-amber-100 bg-amber-50/70 p-3 text-xs text-slate-700"
        >
          <p className="font-semibold text-slate-950">
            [{index + 1}] {citation.title}
          </p>
          <p className="mt-1">Section: {citation.section || 'Untitled section'}</p>
          <p>Score: {citation.score.toFixed(2)}</p>
          {citation.sourceUrl ? (
            <Link className="mt-1 inline-block text-amber-700 underline" href={citation.sourceUrl} target="_blank">
              Open source URL
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}
