'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingState } from '@/components/loading-state'
import { ChunkList } from '@/features/documents/chunk-list'
import { useChunks, useDocuments } from '@/features/documents/api'
import { DocumentTable } from '@/features/documents/document-table'

export default function ProjectDocumentsPage({ params }: { params: { projectId: string } }) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined)
  const projectId = params.projectId
  const documents = useDocuments(projectId, 4000)
  const chunks = useChunks(projectId, selectedDocumentId)

  useEffect(() => {
    if (!selectedDocumentId && documents.data?.[0]?.id) {
      setSelectedDocumentId(documents.data[0].id)
    }
  }, [documents.data, selectedDocumentId])

  const selectedDocument = useMemo(
    () => documents.data?.find((document) => document.id === selectedDocumentId),
    [documents.data, selectedDocumentId],
  )

  if (documents.isLoading) {
    return (
      <AppShell title="Documents" description="Inspect document ingestion state and chunks.">
        <LoadingState title="Loading documents" description="Fetching document status and chunk inventory." />
      </AppShell>
    )
  }

  if (documents.error) {
    return (
      <AppShell title="Documents" description="Inspect document ingestion state and chunks.">
        <ErrorState title="Could not load documents" message={documents.error.message} />
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Documents debug UI"
      description="Use this view to inspect ingestion status and chunk quality before attributing failures to retrieval or chat."
    >
      {!documents.data || documents.data.length === 0 ? (
        <EmptyState
          title="No documents indexed yet"
          description="Run indexing from the project overview first, then return here to inspect each document and its chunks."
        />
      ) : (
        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/60 bg-white/85 p-4">
            <DocumentTable
              documents={documents.data}
              onSelect={setSelectedDocumentId}
              selectedDocumentId={selectedDocumentId}
            />
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
