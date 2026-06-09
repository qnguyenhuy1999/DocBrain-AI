import 'reflect-metadata'
import { describe, expect, it, vi } from 'vitest'
import { ChatService } from '../chat.service'
import { AnswerGeneratorService } from '../services/answer-generator.service'
import { CitationBuilderService } from '../services/citation-builder.service'
import { PromptBuilderService } from '../services/prompt-builder.service'

describe('ChatService integration flow', () => {
  it('saves user and assistant messages with citations and fallback title', async () => {
    const prisma = {
      project: {
        findUnique: vi.fn(),
      },
      conversation: {
        findUnique: vi.fn().mockResolvedValue({
          id: '11111111-1111-1111-1111-111111111111',
          projectId: '22222222-2222-2222-2222-222222222222',
          title: null,
          createdAt: new Date('2026-06-09T00:00:00.000Z'),
          updatedAt: new Date('2026-06-09T00:00:00.000Z'),
        }),
        update: vi.fn().mockResolvedValue(undefined),
        findMany: vi.fn(),
        create: vi.fn(),
      },
      message: {
        findMany: vi.fn(),
        create: vi
          .fn()
          .mockResolvedValueOnce({
            id: '33333333-3333-3333-3333-333333333333',
            conversationId: '11111111-1111-1111-1111-111111111111',
            role: 'USER',
            content: 'How do I get started?',
            createdAt: new Date('2026-06-09T00:01:00.000Z'),
          })
          .mockResolvedValueOnce({
            id: '44444444-4444-4444-4444-444444444444',
            conversationId: '11111111-1111-1111-1111-111111111111',
            role: 'ASSISTANT',
            content: 'Start by creating a project. [1]',
            citations: [
              {
                chunkId: 'chunk-1',
                documentId: 'document-1',
                title: 'Getting Started',
                sourceUrl: 'https://example.com/start',
                section: 'Quick Start',
                score: 0.91,
              },
            ],
            createdAt: new Date('2026-06-09T00:01:02.000Z'),
          }),
      },
    }

    const retrievalService = {
      retrieve: vi.fn().mockResolvedValue({
        query: 'How do I get started?',
        topK: 5,
        returnedCount: 1,
        minScore: 0.35,
        matches: [
          {
            chunkId: 'chunk-1',
            documentId: 'document-1',
            title: 'Getting Started',
            sourceUrl: 'https://example.com/start',
            section: 'Quick Start',
            content: 'Start by creating a project.',
            score: 0.91,
            chunkIndex: 0,
          },
        ],
      }),
    }

    const answerGeneratorService = {
      generate: vi.fn().mockResolvedValue('Start by creating a project. [1]'),
    }

    const service = new ChatService(
      prisma as never,
      retrievalService as never,
      new PromptBuilderService(),
      answerGeneratorService as never,
      new CitationBuilderService(),
    )
    const response = await service.sendMessage(
      '11111111-1111-1111-1111-111111111111',
      '  How do I get started?  ',
    )

    expect(retrievalService.retrieve).toHaveBeenCalledWith(
      '22222222-2222-2222-2222-222222222222',
      'How do I get started?',
      {
        topK: 5,
        minScore: 0.35,
      },
    )
    expect(answerGeneratorService.generate).toHaveBeenCalledTimes(1)
    expect(prisma.conversation.update).toHaveBeenCalledWith({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      data: { title: 'How do I get started?' },
    })
    expect(prisma.message.create).toHaveBeenCalledTimes(2)
    expect(prisma.message.create.mock.calls[1]?.[0]).toMatchObject({
      data: {
        conversationId: '11111111-1111-1111-1111-111111111111',
        role: 'ASSISTANT',
        citations: [
          {
            chunkId: 'chunk-1',
            documentId: 'document-1',
            title: 'Getting Started',
            sourceUrl: 'https://example.com/start',
            section: 'Quick Start',
            score: 0.91,
          },
        ],
      },
    })
    expect(response.assistantMessage.citations).toEqual([
      {
        chunkId: 'chunk-1',
        documentId: 'document-1',
        title: 'Getting Started',
        sourceUrl: 'https://example.com/start',
        section: 'Quick Start',
        score: 0.91,
      },
    ])
  })
})
