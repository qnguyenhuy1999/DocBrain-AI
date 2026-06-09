'use client'

import type { Chunk } from '@docbrain/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@docbrain/ui'
import { truncate } from '@/lib/format'

export function ChunkList({ chunks }: { chunks: Chunk[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chunk index</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Token count</TableHead>
          <TableHead>Preview</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chunks.map((chunk) => (
          <TableRow key={chunk.id}>
            <TableCell>{chunk.chunkIndex}</TableCell>
            <TableCell>{chunk.section || 'Untitled section'}</TableCell>
            <TableCell>{chunk.tokenCount}</TableCell>
            <TableCell className="max-w-3xl text-sm text-slate-600">{truncate(chunk.content, 240)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
