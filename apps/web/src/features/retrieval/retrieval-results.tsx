'use client'

import type { RetrieveResponse } from '@docbrain/types'
import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@docbrain/ui'
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
      {/* Metadata summary */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>
            Returned: <strong className="text-slate-950">{result.matches.length}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Top score: <strong className="text-slate-950">{topScore.toFixed(2)}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyJson}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-amber-300 hover:text-amber-700"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>

      {result.matches.map((match, index) => {
        const isLowScore = match.score < LOW_SCORE_THRESHOLD
        return (
          <Card
            key={match.chunkId}
            className={`${isLowScore ? 'border-slate-200 opacity-70 bg-white/60' : 'border-white/60 bg-white/85'}`}
          >
            <CardHeader>
              <CardTitle className="text-xl">
                [{index + 1}] {match.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-950">Score:</span>{' '}
                  <span className={isLowScore ? 'text-rose-600' : undefined}>{match.score.toFixed(2)}</span>
                  {isLowScore ? <span className="ml-1 text-xs text-rose-500">(low)</span> : null}
                </p>
                <p>
                  <span className="font-medium text-slate-950">Section:</span> {match.section || 'Untitled section'}
                </p>
              </div>
              <p>
                <span className="font-medium text-slate-950">Source URL:</span>{' '}
                {match.sourceUrl ? (
                  <Link className="text-amber-700 underline" href={match.sourceUrl} target="_blank">
                    Open source URL
                  </Link>
                ) : (
                  'No source URL'
                )}
              </p>
              <p className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 leading-6">
                {truncate(match.content, 420)}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
