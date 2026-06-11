'use client'

import type { Citation } from '@docbrain/types'
import Link from 'next/link'

export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null

  return (
    <div className="mt-2 grid gap-1.5">
      {citations.map((citation, index) => (
        <div
          key={`${citation.chunkId}-${index}`}
          className="rounded-xl border px-3 py-2.5 text-xs"
          style={{
            background: 'color-mix(in srgb, var(--secondary) 8%, transparent)',
            borderColor: 'color-mix(in srgb, var(--secondary) 20%, transparent)',
            color: 'var(--foreground)',
          }}
        >
          <p className="font-semibold">
            [{index + 1}] {citation.title}
          </p>
          <p className="mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Section: {citation.section || 'Untitled section'} · Score: {citation.score.toFixed(2)}
          </p>
          {citation.sourceUrl ? (
            <Link
              className="mt-1 inline-block underline transition-opacity hover:opacity-70"
              style={{ color: 'var(--secondary)' }}
              href={citation.sourceUrl}
              target="_blank"
            >
              View source ↗
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}
