'use client'

import { AppShell } from '@/components/app-shell'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import { useDocuments } from '@/features/documents/api'
import { useArchiveProject, useIndexProject, useProject } from '@/features/projects/api'
import { ProjectOverview } from '@/features/projects/project-overview'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const [indexFeedback, setIndexFeedback] = useState<string | null>(null)
  const router = useRouter()
  const { projectId } = use(params)
  const project = useProject(projectId)
  const documents = useDocuments(
    projectId,
    project.data && (project.data.processingCount > 0 || project.data.pendingCount > 0)
      ? 4000
      : false,
  )
  const indexProject = useIndexProject(projectId)
  const archiveProject = useArchiveProject(projectId)

  async function handleIndex(): Promise<void> {
    const response = await indexProject.mutateAsync({ maxPages: 30 })
    setIndexFeedback(
      response.status === 'ALREADY_RUNNING' ? 'Indexing already running' : 'Indexing started',
    )
    void project.refetch()
    void documents.refetch()
  }

  if (project.isLoading) {
    return (
      <AppShell
        title="Project detail"
        description="Loading project overview."
        projectId={projectId}
      >
        <LoadingState
          title="Loading project"
          description="Fetching project summary and document stats."
        />
      </AppShell>
    )
  }

  if (project.error) {
    return (
      <AppShell title="Project detail" description="Project lookup failed." projectId={projectId}>
        <ErrorState title="Could not load project" message={project.error.message} />
      </AppShell>
    )
  }

  if (!project.data) {
    return (
      <AppShell title="Project detail" description="Project not found." projectId={projectId}>
        <ErrorState title="Project not found" message="The requested project does not exist." />
      </AppShell>
    )
  }

  return (
    <AppShell
      title={project.data.name}
      projectId={projectId}
      projectName={project.data.name}
    >
      <section className="container py-8">
        <ProjectOverview
          indexError={indexProject.error?.message}
          indexFeedback={indexFeedback}
          isIndexing={indexProject.isPending}
          onIndex={() => void handleIndex()}
          onArchive={() => {
            void archiveProject.mutateAsync().then(() => router.push('/projects'))
          }}
          project={project.data}
        />
      </section>
    </AppShell>
  )
}
