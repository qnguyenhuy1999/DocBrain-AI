'use client'

import type { RetrieveResponse } from '@docbrain/types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@docbrain/ui'
import { EmptyState } from '@/components/empty-state'
import { truncate } from '@/lib/format'

export function RetrievalResults({ result }: { result?: RetrieveResponse }) {
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

  return (
    <div className="grid gap-4">
      {result.matches.map((match, index) => (
        <Card key={match.chunkId} className="border-white/60 bg-white/85">
          <CardHeader>
            <CardTitle className="text-xl">
              [{index + 1}] {match.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="grid gap-2 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-950">Score:</span> {match.score.toFixed(2)}
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
      ))}
    </div>
  )
}
