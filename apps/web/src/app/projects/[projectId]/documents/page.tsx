'use client'

import { useEffect, useMemo, useState } from 'react'
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

export default function ProjectDocumentsPage({ params }: { params: { projectId: string } }) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const projectId = params.projectId
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
      <AppShell title="Documents" description="Inspect document ingestion state and chunks." projectId={projectId} projectName={project.data?.name}>
        <LoadingState title="Loading documents" description="Fetching document status and chunk inventory." />
      </AppShell>
    )
  }

  if (documents.error) {
    return (
      <AppShell title="Documents" description="Inspect document ingestion state and chunks." projectId={projectId} projectName={project.data?.name}>
        <ErrorState title="Could not load documents" message={documents.error.message} />
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Documents debug UI"
      description="Use this view to inspect ingestion status and chunk quality before attributing failures to retrieval or chat."
      projectId={projectId}
      projectName={project.data?.name}
    >
      {!documents.data || documents.data.length === 0 ? (
        <EmptyState
          title="No documents indexed yet"
          description="Run indexing from the project overview first, then return here to inspect each document and its chunks."
        />
      ) : (
        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/60 bg-white/85 p-4">
            {/* Search + status filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search title or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <div className="flex gap-1">
                {statusFilterOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      statusFilter === option
                        ? 'bg-slate-950 text-white shadow'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No documents match the current filter.</p>
            ) : (
              <DocumentTable
                documents={filteredDocuments}
                onSelect={setSelectedDocumentId}
                selectedDocumentId={selectedDocumentId}
              />
            )}
          </div>
          {selectedDocument ? (
            <div className="rounded-3xl border border-white/60 bg-white/85 p-4">
              <div className="mb-4">
                <p className="text-lg font-semibold text-slate-950">{selectedDocument.title}</p>
                <p className="text-sm text-slate-600">Chunks for the selected document.</p>
              </div>
              {chunks.isLoading ? <LoadingState title="Loading chunks" description="Fetching chunk list." /> : null}
              {chunks.error ? <ErrorState title="Could not load chunks" message={chunks.error.message} /> : null}
              {chunks.data ? <ChunkList chunks={chunks.data} /> : null}
            </div>
          ) : null}
        </div>
      )}
    </AppShell>
  )
}
