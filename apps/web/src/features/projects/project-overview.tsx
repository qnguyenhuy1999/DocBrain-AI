'use client'

import type { ProjectOverview as ProjectOverviewType } from '@docbrain/types'
import Link from 'next/link'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, buttonVariants, cn } from '@docbrain/ui'
import { ErrorState } from '@/components/error-state'
import { formatDate } from '@/lib/format'

export function ProjectOverview({
  project,
  onIndex,
  isIndexing,
  indexFeedback,
  indexError,
  onArchive,
}: {
  project: ProjectOverviewType
  onIndex: () => void
  isIndexing: boolean
  indexFeedback: string | null
  indexError?: string
  onArchive: () => void
}) {
  return (
    <div className="grid gap-6">
      <Card className="border-white/60 bg-white/85">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <p className="mt-2 text-sm text-slate-600">{project.description || 'No description provided.'}</p>
            <p className="mt-2 text-sm text-slate-600">{project.rootUrl ?? 'No root URL configured'}</p>
          </div>
          <Badge variant={project.status === 'ACTIVE' ? 'success' : 'outline'}>{project.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Document count" value={project.documentCount} />
            <MetricCard label="Ready count" value={project.readyCount} />
            <MetricCard label="Failed count" value={project.failedCount} />
            <MetricCard label="Processing count" value={project.processingCount} />
            <MetricCard label="Last indexed" value={formatDate(project.lastIndexedAt)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={isIndexing} onClick={onIndex}>
              {isIndexing ? 'Indexing...' : 'Index documentation'}
            </Button>
            <Link className={cn(buttonVariants({ variant: 'outline' }))} href={`/projects/${project.id}/documents`}>
              Open documents
            </Link>
            <Link className={cn(buttonVariants({ variant: 'outline' }))} href={`/projects/${project.id}/retrieve`}>
              Open retrieval playground
            </Link>
            <Link className={cn(buttonVariants({ variant: 'outline' }))} href={`/projects/${project.id}/chat`}>
              Open chat
            </Link>
            {project.status !== 'ARCHIVED' ? (
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={onArchive}
              >
                Archive project
              </Button>
            ) : null}
          </div>
          {indexFeedback ? (
            <p className="text-sm font-medium text-emerald-700">{indexFeedback}</p>
          ) : null}
          {indexError ? <ErrorState title="Indexing failed" message={indexError} /> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}
