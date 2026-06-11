import Link from 'next/link'
import { AppShell } from '@/components/app-shell'

const pipeline = [
  { icon: <GlobeIcon />, label: 'URL', num: '01' },
  { icon: <SearchIcon />, label: 'Crawl', num: '02' },
  { icon: <FileTextIcon />, label: 'Markdown', num: '03' },
  { icon: <DatabaseIcon />, label: 'Chunks', num: '04' },
  { icon: <SparklesIcon />, label: 'Embed', num: '05' },
  { icon: <SearchIcon />, label: 'Retrieve', num: '06' },
  { icon: <BotIcon />, label: 'Chat', num: '07' },
]

const features = [
  {
    icon: <MicroscopeIcon />,
    title: 'Inspect everything',
    description: 'Documents, chunks, offsets, sections. Debug your index like a developer tool.',
  },
  {
    icon: <TargetIcon />,
    title: 'Test retrieval first',
    description: 'Run vector search before chatting. Tune topK and see scores side by side.',
  },
  {
    icon: <QuoteIcon />,
    title: 'Citations you trust',
    description: 'Every assistant answer links back to the exact chunks that produced it.',
  },
]

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
          style={{ background: 'var(--gradient-hero)' }}
        />

        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-fade-up">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium tracking-wide"
                style={{
                  background: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--secondary) 30%, transparent)',
                  color: 'var(--secondary)',
                }}
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: 'var(--secondary)' }} />
                Local MVP · Single-user
              </span>
            </div>

            <h1
              className="animate-fade-up delay-100 mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
              style={{ color: 'var(--foreground)', letterSpacing: '-0.03em' }}
            >
              Chat with your docs,
              <br />
              <span style={{ color: 'var(--secondary)' }}>fully local.</span>
            </h1>

            <p
              className="animate-fade-up delay-200 mt-5 text-lg leading-relaxed"
              style={{ color: 'var(--muted-foreground)', maxWidth: '34rem', margin: '1.25rem auto 0' }}
            >
              DocBrain AI crawls a documentation root URL, chunks and embeds the content, and lets you retrieve and chat with it — with full citations and a debug-first UI.
            </p>

            <div className="animate-fade-up delay-300 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold h-11 rounded-lg px-8 transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: 'var(--secondary)',
                  color: '#000',
                  boxShadow: 'var(--shadow-amber)',
                }}
              >
                Open Projects
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="container pb-10">
        <div
          className="animate-fade-up delay-400 rounded-xl border p-6 md:p-8"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-[0.12em] text-center mb-6"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Ingestion Pipeline
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1.5 md:gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative grid h-12 w-12 place-items-center rounded-xl transition-all hover:scale-105"
                    style={{
                      background: 'var(--muted)',
                      border: '1px solid var(--border)',
                      color: 'var(--secondary)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    {step.icon}
                    <span
                      className="absolute -top-2 -right-1.5 text-[9px] font-bold tabular-nums"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-geist-mono)' }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{step.label}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <ChevronRightIcon />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-fade-up rounded-xl border p-6 card-hover`}
              style={{
                background: 'var(--card)',
                animationDelay: `${500 + i * 100}ms`,
              }}
            >
              <div
                className="mb-4 grid h-10 w-10 place-items-center rounded-lg"
                style={{
                  background: 'color-mix(in srgb, var(--secondary) 12%, transparent)',
                  color: 'var(--secondary)',
                  border: '1px solid color-mix(in srgb, var(--secondary) 20%, transparent)',
                }}
              >
                {feature.icon}
              </div>
              <div className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
                {feature.title}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
    </svg>
  )
}

function BotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  )
}

function MicroscopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/>
      <path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  )
}
