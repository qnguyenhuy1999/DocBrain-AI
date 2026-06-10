'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import { ChunkList } from '@/features/documents/chunk-list'
import { useChunks, useDocuments } from '@/features/documents/api'
import { useProject } from '@/features/projects/api'
import { DocumentTable } from '@/features/documents/document-table'
import type { DocumentListItem } from '@docbrain/types'

type StatusFilter = 'ALL' | 'READY' | 'FAILED' | 'PROCESSING'

const statusFilterOptions: StatusFilter[] = ['ALL', 'READY', 'PROCESSING', 'FAILED']

export default function ProjectDocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const { projectId } = use(params)
  const project = useProject(projectId)
  const documents = useDocuments(projectId, 4000)
  const chunks = useChunks(projectId, selectedDocumentId)

  useEffect(() => {
    if (!selectedDocumentId && documents.data?.[0]?.id) {
      setSelectedDocumentId(documents.data[0].id)
    }
  }, [documents.data, selectedDocumentId])

  const filteredDocuments = useMemo<DocumentListItem[]>(() => {
    return (documents.data ?? []).filter((doc) => {
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return doc.title.toLowerCase().includes(q) || (doc.sourceUrl ?? '').toLowerCase().includes(q)
      }
      return true
    })
  }, [documents.data, statusFilter, searchQuery])

  const selectedDocument = useMemo(
    () => documents.data?.find((document) => document.id === selectedDocumentId),
    [documents.data, selectedDocumentId],
  )

  if (documents.isLoading) {
    return (
      <AppShell projectId={projectId} projectName={project.data?.name}>
        <LoadingState title="Loading documents" description="Fetching document status and chunk inventory." />
      </AppShell>
    )
  }

  if (documents.error) {
    return (
      <AppShell projectId={projectId} projectName={project.data?.name}>
        <ErrorState title="Could not load documents" message={documents.error.message} />
      </AppShell>
    )
  }

  return (
    <AppShell
      projectId={projectId}
      projectName={project.data?.name}
    >
      <section className="container py-8 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Inspect what the crawler found and indexed.
            </p>
          </div>
        </div>
        {!documents.data || documents.data.length === 0 ? (
          <EmptyState
            title="No documents indexed yet"
            description="Run indexing from the project overview first, then return here to inspect each document and its chunks."
          />
        ) : (
          <div className="grid gap-5">
            <div className="rounded-lg border p-3 flex flex-col md:flex-row gap-3 md:items-center" style={{ background: 'var(--card)' }}>
              <div className="flex flex-wrap gap-1">
                {statusFilterOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className="rounded-md px-3 h-8 text-sm font-medium transition-colors"
                    style={statusFilter === option
                      ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                      : { color: 'var(--foreground)' }
                    }
                  >
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="md:ml-auto md:w-72 relative">
                <input
                  type="text"
                  placeholder="Search title or URL…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border pl-8 pr-3 py-2 text-sm h-9"
                  style={{ background: 'var(--background)', borderColor: 'var(--input)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            {filteredDocuments.length === 0 ? (
              <p className="py-6 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>No documents match the current filter.</p>
            ) : (
              <DocumentTable
                documents={filteredDocuments}
                onSelect={setSelectedDocumentId}
                selectedDocumentId={selectedDocumentId}
              />
            )}
            {selectedDocument ? (
              <div className="rounded-lg border p-4" style={{ background: 'var(--card)' }}>
                <div className="mb-4">
                  <p className="text-lg font-semibold">{selectedDocument.title}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chunks for the selected document.</p>
                </div>
                {chunks.isLoading ? <LoadingState title="Loading chunks" description="Fetching chunk list." /> : null}
                {chunks.error ? <ErrorState title="Could not load chunks" message={chunks.error.message} /> : null}
                {chunks.data ? <ChunkList chunks={chunks.data} /> : null}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AppShell>
  )
}
