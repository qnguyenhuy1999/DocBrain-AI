import { AppShell } from '@/components/app-shell'
import { ProjectForm } from '@/features/projects/project-form'

export default function NewProjectPage() {
  return (
    <AppShell>
      <section className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Create a crawl target with a root URL.
          </p>
        </div>
        <ProjectForm />
      </section>
    </AppShell>
  )
}
