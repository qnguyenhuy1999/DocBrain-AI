import { Injectable } from '@nestjs/common'

const TARGET_TOKENS = 800
const OVERLAP_TOKENS = 120
const CHARS_PER_TOKEN = 4

export interface ChunkDraft {
  content: string
  section?: string
  tokenCount: number
  chunkIndex: number
  startOffset?: number
  endOffset?: number
  metadata?: Record<string, unknown>
}

interface MarkdownBlock {
  raw: string
  section?: string
  start: number
  end: number
}

@Injectable()
export class ChunkerService {
  chunk(markdown: string): ChunkDraft[] {
    const normalizedMarkdown = markdown.trim()
    if (!normalizedMarkdown) {
      return []
    }

    const blocks = this.toBlocks(normalizedMarkdown)
    const chunks: ChunkDraft[] = []

    let currentBlocks: MarkdownBlock[] = []

    const flush = () => {
      if (currentBlocks.length === 0) {
        return
      }

      const chunk = this.buildChunk(currentBlocks, chunks.length)
      if (chunk) {
        chunks.push(chunk)
      }

      const overlapBlocks = this.getOverlapBlocks(currentBlocks)
      currentBlocks = [...overlapBlocks]
    }

    for (const block of blocks) {
      const projectedBlocks = [...currentBlocks, block]
      const projectedText = this.composeChunkContent(projectedBlocks)

      if (currentBlocks.length > 0 && this.countTokens(projectedText) > TARGET_TOKENS) {
        flush()
      }

      currentBlocks.push(block)
    }

    flush()

    return chunks
  }

  private toBlocks(markdown: string): MarkdownBlock[] {
    const parts = markdown.split(/\n{2,}/)
    const blocks: MarkdownBlock[] = []
    let searchStart = 0
    let currentSection: string | undefined

    for (const part of parts) {
      const raw = part.trim()
      if (!raw) {
        continue
      }

      const start = markdown.indexOf(raw, searchStart)
      const end = start + raw.length
      searchStart = end

      const headingMatch = raw.match(/^#{1,6}\s+(.+)$/m)
      if (headingMatch) {
        currentSection = headingMatch[1].trim()
      }

      blocks.push({
        raw,
        section: currentSection,
        start,
        end,
      })
    }

    return blocks
  }

  private buildChunk(blocks: MarkdownBlock[], chunkIndex: number): ChunkDraft | null {
    const content = this.composeChunkContent(blocks).trim()
    if (!content) {
      return null
    }

    return {
      content,
      section: blocks.find((block) => block.section)?.section,
      tokenCount: this.countTokens(content),
      chunkIndex,
      startOffset: blocks[0]?.start,
      endOffset: blocks.at(-1)?.end,
      metadata: {
        strategy: 'markdown-v1',
      },
    }
  }

  private composeChunkContent(blocks: MarkdownBlock[]): string {
    if (blocks.length === 0) {
      return ''
    }

    const section = blocks.find((block) => block.section)?.section
    const body = blocks
      .map((block) => block.raw)
      .join('\n\n')
      .trim()

    if (!section || body.startsWith('#')) {
      return body
    }

    return `## ${section}\n\n${body}`
  }

  private getOverlapBlocks(blocks: MarkdownBlock[]): MarkdownBlock[] {
    const overlapBlocks: MarkdownBlock[] = []
    let accumulatedTokens = 0

    for (const block of [...blocks].reverse()) {
      overlapBlocks.unshift(block)
      accumulatedTokens += this.countTokens(block.raw)

      if (accumulatedTokens >= OVERLAP_TOKENS) {
        break
      }
    }

    return overlapBlocks
  }

  private countTokens(text: string): number {
    return Math.max(1, Math.ceil(text.length / CHARS_PER_TOKEN))
  }
}
