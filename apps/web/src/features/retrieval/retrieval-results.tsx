'use client'

import type { RetrieveResponse } from '@docbrain/types'
import Link from 'next/link'
import { useState } from 'react'
import { EmptyState } from '@/components/empty-state'
import { truncate } from '@/lib/format'

const LOW_SCORE_THRESHOLD = 0.3

export function RetrievalResults({ result }: { result?: RetrieveResponse }) {
  const [copied, setCopied] = useState(false)

  if (!result) {
    return (
      <EmptyState
        title="No retrieval run yet"
        description="Submit a question to inspect which chunks the backend considers most relevant."
      />
    )
  }

  if (result.matches.length === 0) {
    return (
      <EmptyState
        title="No retrieval matches"
        description="Try a broader query, larger Top K, or a lower minimum score."
      />
    )
  }

  const topScore = Math.max(...result.matches.map((m) => m.score))

  function handleCopyJson() {
    void navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <span>
            Returned: <strong style={{ color: 'var(--foreground)' }}>{result.matches.length}</strong>
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span>
            Top score: <strong style={{ color: 'var(--foreground)' }}>{topScore.toFixed(2)}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyJson}
          className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>

      {result.matches.map((match, index) => {
        const isLowScore = match.score < LOW_SCORE_THRESHOLD
        return (
          <div
            key={match.chunkId}
            className="rounded-lg border p-5"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              opacity: isLowScore ? 0.7 : 1,
            }}
          >
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
              [{index + 1}] {match.title}
            </h3>
            <div className="space-y-2.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Score:</span>{' '}
                  <span style={isLowScore ? { color: 'var(--destructive)' } : {}}>{match.score.toFixed(2)}</span>
                  {isLowScore ? <span className="ml-1 text-xs" style={{ color: 'var(--destructive)' }}>(low)</span> : null}
                </p>
                <p>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Section:</span> {match.section || 'Untitled section'}
                </p>
              </div>
              <p>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>Source URL:</span>{' '}
                {match.sourceUrl ? (
                  <Link className="underline" style={{ color: 'var(--secondary)' }} href={match.sourceUrl} target="_blank">
                    Open source URL
                  </Link>
                ) : (
                  'No source URL'
                )}
              </p>
              <p
                className="rounded-md border p-4 leading-6 text-sm"
                style={{ background: 'var(--accent)', borderColor: 'var(--border)', color: 'var(--accent-foreground)' }}
              >
                {truncate(match.content, 420)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
