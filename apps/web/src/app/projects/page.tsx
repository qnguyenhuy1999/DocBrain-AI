import Link from 'next/link'
import { buttonVariants, cn } from '@docbrain/ui'
import { AppShell } from '@/components/app-shell'
import { ProjectList } from '@/features/projects/project-list'

export default function ProjectsPage() {
  return (
    <AppShell
      title="Projects"
      description="Every project tracks one documentation source tree and its downstream retrieval and chat behavior."
      actions={
        <Link className={cn(buttonVariants())} href="/projects/new">
          Create project
        </Link>
      }
    >
      <ProjectList />
    </AppShell>
  )
}
