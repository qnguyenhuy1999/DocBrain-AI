'use client'

import type { ProjectOverview as ProjectOverviewType } from '@docbrain/types'
import Link from 'next/link'
import { ErrorState } from '@/components/error-state'

function formatDate(dateStr: Date | string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(dateStr: Date | string | null | undefined): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 20 12 6 21 6 3"/>
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
      <path d="M10 12h4"/>
    </svg>
  )
}

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="rounded-lg border p-4" style={{ background: 'var(--card)' }}>
      <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: color ?? 'var(--foreground)' }}>
        {value}
      </div>
    </div>
  )
}

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
  const readyCount = project.readyCount ?? 0
  const processingCount = project.processingCount ?? 0
  const pendingCount = project.pendingCount ?? 0
  const failedCount = project.failedCount ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight truncate">{project.name}</h1>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={project.status === 'ACTIVE'
                ? { background: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)', border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)' }
                : { border: '1px solid var(--border)', color: 'var(--muted-foreground)' }
              }
            >
              {project.status === 'ACTIVE' ? 'active' : 'archived'}
            </span>
          </div>
          {project.description ? (
            <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--muted-foreground)' }}>
              {project.description}
            </p>
          ) : null}
          {project.rootUrl ? (
            <a
              href={project.rootUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {project.rootUrl}
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onIndex}
            disabled={isIndexing}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <PlayIcon />
            {isIndexing ? 'Indexing...' : 'Index documentation'}
          </button>
          <Link
            href={`/projects/${project.id}/documents`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border transition-colors"
            style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
          >
            Documents
          </Link>
          <Link
            href={`/projects/${project.id}/retrieve`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border transition-colors"
            style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
          >
            Retrieve
          </Link>
          <Link
            href={`/projects/${project.id}/chat`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border transition-colors"
            style={{ background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
          >
            Chat
          </Link>
          {project.status !== 'ARCHIVED' ? (
            <button
              onClick={onArchive}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <ArchiveIcon />
              Archive
            </button>
          ) : null}
        </div>
      </div>

      {indexFeedback ? (
        <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>{indexFeedback}</p>
      ) : null}
      {indexError ? <ErrorState title="Indexing failed" message={indexError} /> : null}

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <StatCard label="Documents" value={project.documentCount} />
        <StatCard label="Ready" value={readyCount} color="var(--success)" />
        <StatCard label="Processing" value={processingCount} color="var(--info)" />
        <StatCard label="Pending" value={pendingCount} />
        <StatCard label="Failed" value={failedCount} color="var(--destructive)" />
      </div>

      <div className="rounded-lg border p-5" style={{ background: 'var(--card)' }}>
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Last indexed</div>
            <div>{formatDate(project.lastIndexedAt)}{project.lastIndexedAt ? ` (${timeAgo(project.lastIndexedAt)})` : ''}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Created</div>
            <div>{formatDate(project.createdAt)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Updated</div>
            <div>{formatDate(project.updatedAt ?? project.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
