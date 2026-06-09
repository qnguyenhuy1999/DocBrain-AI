import { describe, expect, it } from 'vitest'
import { ChunkerService } from '../chunker.service'

describe('ChunkerService', () => {
  const service = new ChunkerService()

  it('preserves headings and offsets when chunking markdown', () => {
    const markdown = `# Intro

Welcome to the guide.

## Install

Run pnpm install and pnpm dev.

## Deploy

Deploy with your platform config.`

    const chunks = service.chunk(markdown)

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks[0]?.section).toBe('Intro')
    expect(chunks[0]?.startOffset).toBe(0)
    expect(chunks[0]?.endOffset).toBeGreaterThan(0)
    expect(chunks.some((chunk) => chunk.content.includes('pnpm install'))).toBe(true)
  })

  it('returns an empty list for blank markdown', () => {
    expect(service.chunk('   \n\n  ')).toEqual([])
  })
})
