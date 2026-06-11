'use client'

import type { DocumentListItem } from '@docbrain/types'
import { formatDate, truncate } from '@/lib/format'

function StatusBadge({ status }: { status: DocumentListItem['status'] }) {
  const styles: Record<DocumentListItem['status'], { background: string; color: string }> = {
    READY: { background: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' },
    FAILED: { background: 'color-mix(in srgb, var(--destructive) 15%, transparent)', color: 'var(--destructive)' },
    PROCESSING: { background: 'color-mix(in srgb, var(--info) 15%, transparent)', color: 'var(--info)' },
    PENDING: { background: 'var(--muted)', color: 'var(--muted-foreground)' },
  }
  const labels: Record<DocumentListItem['status'], string> = {
    READY: 'Ready', FAILED: 'Failed', PROCESSING: 'Processing', PENDING: 'Pending',
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
      style={styles[status]}
    >
      {labels[status]}
    </span>
  )
}

export function DocumentTable({
  documents,
  selectedDocumentId,
  onSelect,
}: {
  documents: DocumentListItem[]
  selectedDocumentId?: string
  onSelect: (documentId: string) => void
}) {
  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {documents.map((document) => (
          <div
            key={document.id}
            className="rounded-lg border p-4"
            style={{
              background: selectedDocumentId === document.id ? 'color-mix(in srgb, var(--secondary) 10%, var(--card))' : 'var(--card)',
              borderColor: selectedDocumentId === document.id ? 'var(--secondary)' : 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium leading-snug" style={{ color: 'var(--foreground)' }}>{document.title}</p>
              <StatusBadge status={document.status} />
            </div>
            {document.sourceUrl ? (
              <p className="mt-1 text-xs break-all" style={{ color: 'var(--muted-foreground)' }}>{truncate(document.sourceUrl, 60)}</p>
            ) : (
              <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>No URL</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span>{document.chunkCount} chunks</span>
              <span>{formatDate(document.indexedAt)}</span>
            </div>
            {document.errorMessage ? (
              <p className="mt-2 text-xs" style={{ color: 'var(--destructive)' }}>{truncate(document.errorMessage, 72)}</p>
            ) : null}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => onSelect(document.id)}
                className="inline-flex items-center justify-center rounded-md border text-xs font-medium h-7 px-3 transition-colors"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {selectedDocumentId === document.id ? 'Selected' : 'View chunks'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-lg border overflow-hidden" style={{ background: 'var(--card)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Source URL</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Chunks</th>
              <th className="px-4 py-3 text-left font-medium">Indexed at</th>
              <th className="px-4 py-3 text-left font-medium">Error</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
                className="border-b last:border-0 transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  background: selectedDocumentId === document.id ? 'color-mix(in srgb, var(--secondary) 8%, var(--card))' : undefined,
                }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{document.title}</td>
                <td className="px-4 py-3 max-w-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {document.sourceUrl ? truncate(document.sourceUrl, 48) : 'No URL'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={document.status} />
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{document.chunkCount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{formatDate(document.indexedAt)}</td>
                <td className="px-4 py-3 max-w-xs text-xs" style={{ color: 'var(--destructive)' }}>
                  {document.errorMessage ? truncate(document.errorMessage, 72) : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(document.id)}
                    className="inline-flex items-center justify-center rounded-md border text-xs font-medium h-7 px-3 transition-colors whitespace-nowrap"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    {selectedDocumentId === document.id ? 'Selected' : 'View chunks'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
