'use client'

import type { DocumentListItem } from '@docbrain/types'
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@docbrain/ui'
import { formatDate, truncate } from '@/lib/format'

function statusVariant(status: DocumentListItem['status']) {
  if (status === 'READY') {
    return 'success'
  }
  if (status === 'FAILED') {
    return 'danger'
  }
  if (status === 'PROCESSING') {
    return 'warning'
  }
  return 'outline'
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
              <Badge variant={statusVariant(document.status)}>
                {document.status === 'READY'
                  ? 'READY = usable'
                  : document.status === 'PROCESSING'
                    ? 'PROCESSING = loading'
                    : document.status === 'FAILED'
                      ? 'FAILED = show error'
                      : 'PENDING = waiting'}
              </Badge>
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
  )
}
