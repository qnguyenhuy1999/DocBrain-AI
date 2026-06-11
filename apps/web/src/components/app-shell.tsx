'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
)

const PROJECT_TABS = [
  { segment: '', label: 'Overview' },
  { segment: 'documents', label: 'Documents' },
  { segment: 'retrieve', label: 'Retrieve' },
  { segment: 'chat', label: 'Chat' },
]

export function AppShell({
  children,
  projectId,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  projectId?: string
}) {
  const pathname = usePathname()
  const isProjectsActive = pathname.startsWith('/projects')

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-25"
        style={{ background: 'color-mix(in srgb, var(--background) 85%, transparent)' }}
      >
        <div className="container flex h-14 items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg shrink-0 transition-all group-hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 60%, var(--primary)) 100%)',
                color: '#000',
                boxShadow: 'var(--shadow-amber)',
              }}
            >
              <BrainIcon />
            </span>
            <span
              className="font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              DocBrain<span style={{ color: 'var(--secondary)' }}> AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all"
              style={
                isProjectsActive
                  ? {
                      background: 'color-mix(in srgb, var(--secondary) 15%, transparent)',
                      color: 'var(--secondary)',
                      border: '1px solid color-mix(in srgb, var(--secondary) 25%, transparent)',
                    }
                  : { color: 'var(--muted-foreground)', border: '1px solid transparent' }
              }
            >
              <FolderIcon />
              Projects
            </Link>
          </nav>

          <div
            className="ml-auto hidden sm:flex items-center gap-2 text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-pulse-dot"
                style={{ background: 'var(--success)', opacity: 0.5 }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: 'var(--success)' }}
              />
            </span>
            <span className="font-medium">Connected</span>
          </div>
        </div>

        {projectId ? (
          <div
            className="container flex items-center gap-1 overflow-x-auto -mb-px"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {PROJECT_TABS.map((tab) => {
              const href =
                tab.segment === ''
                  ? `/projects/${projectId}`
                  : `/projects/${projectId}/${tab.segment}`
              const active = tab.segment === '' ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-3 h-10 inline-flex items-center text-sm border-b-2 whitespace-nowrap transition-colors font-medium"
                  style={
                    active
                      ? { borderColor: 'var(--secondary)', color: 'var(--foreground)' }
                      : { borderColor: 'transparent', color: 'var(--muted-foreground)' }
                  }
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="border-t py-5 text-center text-xs"
        style={{ color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}
      >
        DocBrain AI · Local MVP
      </footer>
    </div>
  )
}
