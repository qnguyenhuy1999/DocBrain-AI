import { describe, expect, it } from 'vitest'
import { PromptBuilderService } from '../prompt-builder.service'

describe('PromptBuilderService', () => {
  it('builds a grounded prompt with numbered context blocks', () => {
    const service = new PromptBuilderService()

    const result = service.build('How do I get started?', [
      {
        chunkId: 'chunk-1',
        documentId: 'document-1',
        title: 'Getting Started',
        sourceUrl: 'https://example.com/start',
        section: 'Quick Start',
        content: 'Install dependencies first.',
        score: 0.91,
        chunkIndex: 0,
      },
    ])

    expect(result.systemPrompt).toContain('Answer only using the provided documentation context')
    expect(result.userPrompt).toContain('Question:\nHow do I get started?')
    expect(result.userPrompt).toContain('[1] Title: Getting Started')
    expect(result.userPrompt).toContain('Section: Quick Start')
    expect(result.userPrompt).toContain('URL: https://example.com/start')
    expect(result.matches).toHaveLength(1)
  })
})
