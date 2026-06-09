import { AppShell } from '@/components/app-shell'
import { ProjectForm } from '@/features/projects/project-form'

export default function NewProjectPage() {
  return (
    <AppShell
      title="New project"
      description="Create a crawl target with a root URL. The crawler and embedding pipeline will build the retrieval corpus from there."
    >
      <ProjectForm />
    </AppShell>
  )
}
