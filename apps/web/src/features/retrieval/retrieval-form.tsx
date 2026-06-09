'use client'

import { RetrieveSchema } from '@docbrain/validators'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@docbrain/ui'
import { useState } from 'react'
import { ErrorState } from '@/components/error-state'

type RetrievalFormState = {
  query: string
  topK: string
  minScore: string
}

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
    <Card className="border-white/60 bg-white/85">
      <CardHeader>
        <CardTitle>Retrieval playground</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-[1fr_120px_140px_auto]" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2 md:col-span-4">
            <label className="text-sm font-medium text-slate-900" htmlFor="retrieval-query">
              Query
            </label>
            <Input
              id="retrieval-query"
              placeholder="How do I configure the API?"
              value={formState.query}
              onChange={(event) => setFormState((current) => ({ ...current, query: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="retrieval-topk">
              Top K
            </label>
            <Input
              id="retrieval-topk"
              inputMode="numeric"
              value={formState.topK}
              onChange={(event) => setFormState((current) => ({ ...current, topK: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="retrieval-minscore">
              Min score
            </label>
            <Input
              id="retrieval-minscore"
              placeholder="Optional"
              value={formState.minScore}
              onChange={(event) => setFormState((current) => ({ ...current, minScore: event.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? 'Searching...' : 'Run retrieval'}
            </Button>
          </div>
        </form>
        {validationError ? (
          <div className="mt-4">
            <ErrorState title="Validation failed" message={validationError} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
