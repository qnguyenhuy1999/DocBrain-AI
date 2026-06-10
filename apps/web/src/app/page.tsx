import Link from 'next/link'
import { AppShell } from '@/components/app-shell'

const pipeline = [
  { icon: <GlobeIcon />, label: 'URL' },
  { icon: <SearchIcon />, label: 'Crawl' },
  { icon: <FileTextIcon />, label: 'Markdown' },
  { icon: <DatabaseIcon />, label: 'Chunks' },
  { icon: <SparklesIcon />, label: 'Embeddings' },
  { icon: <SearchIcon />, label: 'Retrieve' },
  { icon: <BotIcon />, label: 'Chat' },
]

export default function HomePage() {
  return (
    <AppShell>
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium" style={{ background: 'var(--card)', color: 'var(--muted-foreground)' }}>
            Local MVP · Single-user
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Chat with your documentation, locally.
          </h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--muted-foreground)' }}>
            DocBrain AI crawls a documentation root URL, chunks and embeds the content, and lets you retrieve and chat with it — with full citations and a debug-first UI.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium h-11 rounded-md px-8 transition-colors"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Open Projects
              <ArrowRightIcon />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border mt-14 p-6 md:p-8" style={{ background: 'var(--card)' }}>
          <div className="text-xs font-medium uppercase tracking-wider text-center mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Pipeline
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 md:gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border shadow-sm" style={{ background: 'var(--card)', color: 'var(--primary)' }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{step.label}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <ArrowRightSmallIcon />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-5" style={{ background: 'var(--card)' }}>
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>Inspect everything</div>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Documents, chunks, offsets, sections. Debug your index like a developer tool.</p>
          </div>
          <div className="rounded-lg border p-5" style={{ background: 'var(--card)' }}>
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>Test retrieval first</div>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Run vector search before chatting. Tune topK and see scores side by side.</p>
          </div>
          <div className="rounded-lg border p-5" style={{ background: 'var(--card)' }}>
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>Citations you trust</div>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Every assistant answer links back to the exact chunks that produced it.</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function ArrowRightSmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted-foreground)' }}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
    </svg>
  )
}

function BotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  )
}
