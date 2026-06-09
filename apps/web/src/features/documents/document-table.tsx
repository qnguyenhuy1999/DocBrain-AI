'use client'

import type { DocumentListItem } from '@docbrain/types'
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@docbrain/ui'
import { formatDate, truncate } from '@/lib/format'

function statusVariant(status: DocumentListItem['status']) {
  if (status === 'READY') return 'success'
  if (status === 'FAILED') return 'danger'
  if (status === 'PROCESSING') return 'warning'
  return 'outline'
}

function statusLabel(status: DocumentListItem['status']) {
  if (status === 'READY') return 'Ready'
  if (status === 'PROCESSING') return 'Processing'
  if (status === 'FAILED') return 'Failed'
  return 'Pending'
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
      {/* Mobile card list */}
      <div className="space-y-3 sm:hidden">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`rounded-2xl border p-4 ${selectedDocumentId === document.id ? 'border-amber-300 bg-amber-50/80' : 'border-slate-200 bg-white'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-slate-950 leading-snug">{document.title}</p>
              <Badge variant={statusVariant(document.status)}>{statusLabel(document.status)}</Badge>
            </div>
            {document.sourceUrl ? (
              <p className="mt-1 text-xs text-slate-500 break-all">{truncate(document.sourceUrl, 60)}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">No URL</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{document.chunkCount} chunks</span>
              <span>{formatDate(document.indexedAt)}</span>
            </div>
            {document.errorMessage ? (
              <p className="mt-2 text-xs text-rose-700">{truncate(document.errorMessage, 72)}</p>
            ) : null}
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => onSelect(document.id)}>
                {selectedDocumentId === document.id ? 'Selected' : 'View chunks'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Chunk count</TableHead>
              <TableHead>Indexed at</TableHead>
              <TableHead>Error message</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id} className={selectedDocumentId === document.id ? 'bg-amber-50/80' : undefined}>
                <TableCell className="font-medium text-slate-950">{document.title}</TableCell>
                <TableCell className="text-slate-600">
                  {document.sourceUrl ? truncate(document.sourceUrl, 48) : 'No URL'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(document.status)}>{statusLabel(document.status)}</Badge>
                </TableCell>
                <TableCell>{document.chunkCount}</TableCell>
                <TableCell>{formatDate(document.indexedAt)}</TableCell>
                <TableCell className="max-w-xs text-sm text-rose-700">
                  {document.errorMessage ? truncate(document.errorMessage, 72) : '-'}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => onSelect(document.id)}>
                    {selectedDocumentId === document.id ? 'Selected' : 'View chunks'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
