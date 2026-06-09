import { MIN_RETRIEVAL_SCORE, RAG_TOP_K } from '@docbrain/config'
import type { ChatResponse, Citation, Conversation, Message, RetrievalMatch } from '@docbrain/types'
import { Prisma, MessageRole } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { RetrievalService } from '../retrieval/retrieval.service'
import { AnswerGeneratorService } from './services/answer-generator.service'
import { CitationBuilderService } from './services/citation-builder.service'
import { PromptBuilderService } from './services/prompt-builder.service'

const NO_CONTEXT_ANSWER =
  'I do not know based on the indexed docs. No relevant documentation chunks met the retrieval threshold for this question.'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly retrievalService: RetrievalService,
    private readonly promptBuilderService: PromptBuilderService,
    private readonly answerGeneratorService: AnswerGeneratorService,
    private readonly citationBuilderService: CitationBuilderService,
  ) {}

  async createConversation(projectId: string, title?: string): Promise<Conversation> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }

    return this.prisma.conversation.create({
      data: {
        projectId,
        title: title?.trim() || null,
      },
    })
  }

  async listProjectConversations(projectId: string): Promise<Conversation[]> {
    await this.ensureProject(projectId)

    return this.prisma.conversation.findMany({
      where: { projectId },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    await this.ensureConversation(conversationId)

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })

    return messages.map((message) => this.mapMessage(message))
  }

  async sendMessage(conversationId: string, message: string): Promise<ChatResponse> {
    const conversation = await this.ensureConversation(conversationId)
    const normalizedMessage = message.trim()

    const userMessageRecord = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.USER,
        content: normalizedMessage,
      },
    })

    if (!conversation.title) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { title: this.buildConversationTitle(normalizedMessage) },
      })
    }

    const retrieval = await this.retrievalService.retrieve(conversation.projectId, normalizedMessage, {
      topK: RAG_TOP_K,
      minScore: MIN_RETRIEVAL_SCORE,
    })

    const citations = this.citationBuilderService.build(retrieval.matches)
    const assistantContent =
      retrieval.matches.length === 0
        ? NO_CONTEXT_ANSWER
        : await this.generateGroundedAnswer(normalizedMessage, retrieval.matches)

    const assistantMessageRecord = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.ASSISTANT,
        content: assistantContent,
        citations: citations as unknown as Prisma.JsonArray,
      },
    })

    return {
      conversationId,
      userMessage: this.mapMessage(userMessageRecord),
      assistantMessage: this.mapMessage(assistantMessageRecord, citations),
    }
  }

  private async generateGroundedAnswer(message: string, matches: RetrievalMatch[]): Promise<string> {
    const prompt = this.promptBuilderService.build(message, matches)
    return this.answerGeneratorService.generate(prompt.systemPrompt, prompt.userPrompt)
  }

  private async ensureProject(projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }
  }

  private async ensureConversation(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, projectId: true, title: true, createdAt: true, updatedAt: true },
    })

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} was not found`)
    }

    return conversation
  }

  private buildConversationTitle(message: string): string {
    return message.slice(0, 80)
  }

  private mapMessage(
    message: {
      id: string
      conversationId: string
      role: MessageRole
      content: string
      citations?: unknown
      createdAt: Date
    },
    citationsOverride?: Citation[],
  ): Message {
    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      citations: citationsOverride ?? this.parseCitations(message.citations),
      createdAt: message.createdAt,
    }
  }

  private parseCitations(value: unknown): Citation[] | undefined {
    if (!Array.isArray(value)) {
      return undefined
    }

    return value
      .filter(
        (item): item is Citation =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.chunkId === 'string' &&
          typeof item.documentId === 'string' &&
          typeof item.title === 'string' &&
          typeof item.score === 'number',
      )
      .map((item) => ({
        chunkId: item.chunkId,
        documentId: item.documentId,
        title: item.title,
        sourceUrl: item.sourceUrl ?? null,
        section: item.section ?? null,
        score: item.score,
      }))
  }
}
