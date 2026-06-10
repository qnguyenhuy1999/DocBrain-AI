'use client'

import type { ProjectOverview } from '@docbrain/types'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import { useProjects } from './api'

function timeAgo(dateStr: Date | string | null | undefined): string {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  )
}

function StatBox({ value, label, color }: { value: number | string; label: string; color?: string }) {
  return (
    <div className="rounded-md py-1.5" style={{ background: 'color-mix(in srgb, var(--muted) 40%, transparent)' }}>
      <div className="text-base font-semibold tabular-nums" style={{ color: color ?? 'var(--foreground)' }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectOverview }) {
  const isArchived = project.status === 'ARCHIVED'
  const readyCount = project.readyCount ?? 0
  const processingCount = project.processingCount ?? 0
  const pendingCount = project.pendingCount ?? 0
  const failedCount = project.failedCount ?? 0

  return (
    <div
      className="rounded-lg border p-5 flex flex-col gap-4 transition-shadow hover:shadow-md"
      style={{
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        opacity: isArchived ? 0.6 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{project.name}</h3>
          <p className="text-xs truncate font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {project.rootUrl ?? 'No URL configured'}
          </p>
        </div>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0"
          style={isArchived
            ? { border: '1px solid var(--border)', color: 'var(--muted-foreground)' }
            : { background: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)', border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)' }
          }
        >
          {isArchived ? 'archived' : 'active'}
        </span>
      </div>

      {project.description ? (
        <p className="text-sm line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
          {project.description}
        </p>
      ) : null}

      <div className="grid grid-cols-4 gap-2 text-center">
        <StatBox value={project.documentCount} label="Docs" />
        <StatBox value={readyCount} label="Ready" color="var(--success)" />
        <StatBox value={processingCount + pendingCount} label="Proc" color="var(--info)" />
        <StatBox value={failedCount} label="Fail" color="var(--destructive)" />
      </div>

      <div className="flex items-center justify-between text-xs mt-auto" style={{ color: 'var(--muted-foreground)' }}>
        <span className="inline-flex items-center gap-1">
          <FileTextIcon />
          Last indexed {timeAgo(project.lastIndexedAt)}
        </span>
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 rounded-md px-3 h-7 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--foreground)' }}
        >
          Open
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  )
}

export function ProjectList() {
  const projects = useProjects()

  if (projects.isLoading) {
    return <LoadingState title="Loading projects" description="Reading project inventory and health." />
  }

  if (projects.error) {
    return <ErrorState title="Could not load projects" message={projects.error.message} />
  }

  if (!projects.data || projects.data.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create a project to start crawling docs, debugging ingestion, and testing grounded chat."
        action={
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Create project
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
