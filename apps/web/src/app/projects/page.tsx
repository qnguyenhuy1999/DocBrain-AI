import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { ProjectList } from '@/features/projects/project-list'

export default function ProjectsPage() {
  return (
    <AppShell>
      <section className="container py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Each project indexes one documentation root URL.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            New project
          </Link>
        </div>
        <ProjectList />
      </section>
    </AppShell>
  )
}
