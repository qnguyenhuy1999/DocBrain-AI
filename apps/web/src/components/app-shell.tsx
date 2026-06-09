'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@docbrain/ui'

const topNavItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/projects/new', label: 'New project' },
]

const projectSubNav = [
  { segment: '', label: 'Overview' },
  { segment: 'documents', label: 'Documents' },
  { segment: 'retrieve', label: 'Retrieval' },
  { segment: 'chat', label: 'Chat' },
]

function deriveSection(pathname: string): string {
  const segments = pathname.split('/')
  const last = segments[segments.length - 1]
  if (last === 'documents') return 'Documents'
  if (last === 'retrieve') return 'Retrieval'
  if (last === 'chat') return 'Chat'
  return 'Overview'
}

export function AppShell({
  children,
  title,
  description,
  actions,
  projectId,
  projectName,
}: {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
  projectId?: string
  projectName?: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),linear-gradient(180deg,#fffdf7_0%,#fff8ec_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 rounded-3xl border border-amber-200/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(120,53,15,0.08)] backdrop-blur md:block">
          <Link href="/" className="block border-b border-amber-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              DocBrain
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Ops Console
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Inspect ingestion, retrieval, and grounded chat in one place.
            </p>
          </Link>
          <nav className="mt-5 space-y-2">
            {topNavItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                    active
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                      : 'text-slate-700 hover:bg-amber-50 hover:text-slate-950',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            {projectId ? (
              <div className="mt-4 border-t border-amber-100 pt-4">
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                  {projectName ?? 'Project'}
                </p>
                {projectSubNav.map((item) => {
                  const href =
                    item.segment === ''
                      ? `/projects/${projectId}`
                      : `/projects/${projectId}/${item.segment}`
                  const active =
                    item.segment === ''
                      ? pathname === href
                      : pathname === href || pathname.startsWith(`${href}/`)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'block rounded-2xl px-4 py-2.5 text-sm font-medium transition',
                        active
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-slate-600 hover:bg-amber-50 hover:text-slate-950',
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          {projectId ? (
            <div className="mb-3 flex items-center gap-2 px-1 text-sm text-slate-500">
              <Link href="/projects" className="hover:text-slate-700">
                Projects
              </Link>
              <span>/</span>
              <Link href={`/projects/${projectId}`} className="hover:text-slate-700">
                {projectName ?? 'Project'}
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-800">{deriveSection(pathname)}</span>
            </div>
          ) : null}
          <header className="rounded-3xl border border-white/60 bg-white/85 px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                  Documentation intelligence
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
                {description ? (
                  <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
                ) : null}
              </div>
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>
          <main className="mt-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
