import Link from 'next/link'
import { Card, CardContent, buttonVariants, cn } from '@docbrain/ui'
import { AppShell } from '@/components/app-shell'

export default function HomePage() {
  return (
    <AppShell
      title="DocBrain command center"
      description="Create projects, debug document ingestion, validate retrieval quality, and inspect grounded chat citations."
      actions={
        <Link className={cn(buttonVariants())} href="/projects">
          Open projects
        </Link>
      }
    >
      <Card className="border-white/60 bg-white/85">
        <CardContent className="grid gap-4 p-8 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
            <p className="text-sm font-semibold text-slate-950">Projects</p>
            <p className="mt-2 text-sm text-slate-600">Track crawl targets, indexing status, and project health.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
            <p className="text-sm font-semibold text-slate-950">Retrieval</p>
            <p className="mt-2 text-sm text-slate-600">Validate the actual chunk matches before blaming the chat layer.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
            <p className="text-sm font-semibold text-slate-950">Chat</p>
            <p className="mt-2 text-sm text-slate-600">Inspect conversations and citation grounding from indexed docs.</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
