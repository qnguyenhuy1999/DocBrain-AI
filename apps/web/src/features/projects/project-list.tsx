'use client'

import type { ProjectOverview } from '@docbrain/types'
import Link from 'next/link'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, buttonVariants, cn } from '@docbrain/ui'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import { formatDate } from '@/lib/format'
import { useProjects } from './api'

function statusVariant(status: ProjectOverview['status']) {
  return status === 'ACTIVE' ? 'success' : 'outline'
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
          <Link className={cn(buttonVariants())} href="/projects/new">
            Create project
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {projects.data.map((project) => (
        <Card key={project.id} className="border-white/60 bg-white/85">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <p className="mt-2 text-sm text-slate-600">{project.rootUrl ?? 'No root URL configured'}</p>
            </div>
            <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-900">Created</dt>
                <dd>{formatDate(project.createdAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Documents</dt>
                <dd>{project.documentCount}</dd>
              </div>
            </dl>
            <Link className={cn(buttonVariants())} href={`/projects/${project.id}`}>
              Open project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
