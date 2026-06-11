'use client'

import { RetrieveSchema } from '@docbrain/validators'
import { useState } from 'react'
import { ErrorState } from '@/components/error-state'

type RetrievalFormState = {
  query: string
  topK: string
  minScore: string
}

const inputClass = 'flex h-9 w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none'
const inputStyle = { background: 'var(--background)', borderColor: 'var(--input)', color: 'var(--foreground)' }
const labelClass = 'text-sm font-medium'

export function RetrievalForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (input: { query: string; topK: number; minScore?: number }) => Promise<void>
  isPending: boolean
}) {
  const [formState, setFormState] = useState<RetrievalFormState>({
    query: '',
    topK: '5',
    minScore: '',
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = RetrieveSchema.safeParse({
      query: formState.query,
      topK: Number(formState.topK),
      minScore: formState.minScore ? Number(formState.minScore) : undefined,
    })

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid retrieval request')
      return
    }

    setValidationError(null)
    await onSubmit(parsed.data)
  }

  return (
    <div className="rounded-lg border p-5" style={{ background: 'var(--card)' }}>
      <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Retrieval playground</h2>
      <form className="grid gap-4 md:grid-cols-[1fr_120px_140px_auto]" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-1.5 md:col-span-4">
          <label className={labelClass} style={{ color: 'var(--foreground)' }} htmlFor="retrieval-query">
            Query
          </label>
          <input
            id="retrieval-query"
            className={inputClass}
            style={inputStyle}
            placeholder="How do I configure the API?"
            value={formState.query}
            onChange={(event) => setFormState((current) => ({ ...current, query: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: 'var(--foreground)' }} htmlFor="retrieval-topk">
            Top K
          </label>
          <input
            id="retrieval-topk"
            className={inputClass}
            style={inputStyle}
            inputMode="numeric"
            value={formState.topK}
            onChange={(event) => setFormState((current) => ({ ...current, topK: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: 'var(--foreground)' }} htmlFor="retrieval-minscore">
            Min score
          </label>
          <input
            id="retrieval-minscore"
            className={inputClass}
            style={inputStyle}
            placeholder="Optional"
            value={formState.minScore}
            onChange={(event) => setFormState((current) => ({ ...current, minScore: event.target.value }))}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {isPending ? 'Searching…' : 'Run retrieval'}
          </button>
        </div>
      </form>
      {validationError ? (
        <div className="mt-4">
          <ErrorState title="Validation failed" message={validationError} />
        </div>
      ) : null}
    </div>
  )
}
