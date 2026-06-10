'use client'

import { AppShell } from '@/components/app-shell'
import { ErrorState } from '@/components/error-state'
import { useProject } from '@/features/projects/api'
import { useRetrieve } from '@/features/retrieval/api'
import { RetrievalForm } from '@/features/retrieval/retrieval-form'
import { RetrievalResults } from '@/features/retrieval/retrieval-results'
import { use } from 'react'

export default function ProjectRetrievePage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const project = useProject(projectId)
  const retrieve = useRetrieve(projectId)

  return (
    <AppShell
      title="Retrieval playground"
      description="Probe retrieval quality directly. Inspect scores, sections, and source URLs before evaluating chat responses."
      projectId={projectId}
      projectName={project.data?.name}
    >
      <section className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Retrieval playground</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Probe retrieval quality directly. Inspect scores, sections, and source URLs.</p>
        </div>
        <div className="grid gap-6">
          <RetrievalForm
            isPending={retrieve.isPending}
            onSubmit={async (input) => {
              await retrieve.mutateAsync(input)
            }}
          />
          {retrieve.error ? <ErrorState title="Retrieval failed" message={retrieve.error.message} /> : null}
          <RetrievalResults result={retrieve.data} />
        </div>
      </section>
    </AppShell>
  )
}
