import { createHash } from 'crypto'
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { MIN_EXTRACTED_TEXT_LENGTH } from '@docbrain/config'
import type { ProjectIndexSummary } from '@docbrain/types'
import { DocumentSourceType, DocumentStatus, Prisma } from '@prisma/client'
import pLimit from 'p-limit'
import { PrismaService } from '../../database/prisma.service'
import { ChunkerService } from './chunker.service'
import { ContentExtractorService } from './content-extractor.service'
import { CrawlerService } from './crawler.service'
import { EmbeddingService } from './embedding.service'
import { LinkDiscoveryService } from './link-discovery.service'
import { MarkdownConverterService } from './markdown-converter.service'
import { SitemapDiscoveryService } from './sitemap-discovery.service'
import { createUrlLabel, normalizeDiscoveredUrl } from './url.utils'

const CONCURRENCY = 3

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name)

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(SitemapDiscoveryService)
    private readonly sitemapDiscoveryService: SitemapDiscoveryService,
    @Inject(LinkDiscoveryService) private readonly linkDiscoveryService: LinkDiscoveryService,
    @Inject(CrawlerService) private readonly crawlerService: CrawlerService,
    @Inject(ContentExtractorService)
    private readonly contentExtractorService: ContentExtractorService,
    @Inject(MarkdownConverterService)
    private readonly markdownConverterService: MarkdownConverterService,
    @Inject(ChunkerService) private readonly chunkerService: ChunkerService,
    @Inject(EmbeddingService) private readonly embeddingService: EmbeddingService,
  ) {}

  async indexProject(projectId: string, maxPages: number): Promise<ProjectIndexSummary> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, rootUrl: true },
    })

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`)
    }

    if (!project.rootUrl) {
      throw new Error(`Project ${projectId} does not have a rootUrl`)
    }

    const rootUrl = project.rootUrl
    const discoveredUrls = await this.discoverProjectUrls(rootUrl, maxPages)
    const limit = pLimit(CONCURRENCY)
    const summary: ProjectIndexSummary = {
      totalDiscovered: discoveredUrls.length,
      indexedCount: 0,
      skippedCount: 0,
      failedCount: 0,
    }

    const results = await Promise.allSettled(
      discoveredUrls.map((url) =>
        limit(async () => {
          return this.indexUrl(projectId, url)
        }),
      ),
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        summary[`${result.value}Count`] += 1
        continue
      }

      summary.failedCount += 1
      this.logger.error(
        'Indexing failed at stage=document',
        result.reason instanceof Error ? result.reason.stack : undefined,
      )
    }

    return summary
  }

  private async discoverProjectUrls(rootUrl: string, maxPages: number): Promise<string[]> {
    const normalizedRootUrl = normalizeDiscoveredUrl(rootUrl, rootUrl)
    const seedUrls = normalizedRootUrl ? [normalizedRootUrl] : []
    const sitemapUrls = await this.sitemapDiscoveryService.discover(rootUrl, maxPages)

    if (sitemapUrls.length > 0) {
      return [...new Set([...seedUrls, ...sitemapUrls])].slice(0, maxPages)
    }

    const fallbackUrls = await this.linkDiscoveryService.discover(rootUrl, maxPages)
    return [...new Set([...seedUrls, ...fallbackUrls])].slice(0, maxPages)
  }

  private async indexUrl(projectId: string, url: string): Promise<'indexed' | 'skipped'> {
    let documentId: string | null = null

    try {
      const document = await this.prisma.document.upsert({
        where: {
          projectId_sourceUrl: {
            projectId,
            sourceUrl: url,
          },
        },
        update: {
          title: createUrlLabel(url),
          sourceType: DocumentSourceType.URL,
          status: DocumentStatus.PROCESSING,
          errorMessage: null,
        },
        create: {
          projectId,
          title: createUrlLabel(url),
          sourceType: DocumentSourceType.URL,
          sourceUrl: url,
          status: DocumentStatus.PROCESSING,
        },
        select: {
          id: true,
          title: true,
        },
      })

      documentId = document.id

      const crawledPage = await this.crawlerService.fetchPage(url)
      const extractedContent = this.contentExtractorService.extract(
        crawledPage.html,
        crawledPage.url,
      )
      const markdown = this.markdownConverterService.convert(extractedContent.html)
      if (markdown.length < MIN_EXTRACTED_TEXT_LENGTH) {
        throw new Error(
          `Extracted markdown was too short: expected at least ${MIN_EXTRACTED_TEXT_LENGTH} characters`,
        )
      }

      const contentHash = this.hashContent(markdown)

      const existingDocument = await this.prisma.document.findUnique({
        where: {
          projectId_sourceUrl: {
            projectId,
            sourceUrl: url,
          },
        },
        select: {
          id: true,
          contentHash: true,
          status: true,
          _count: {
            select: {
              chunks: true,
            },
          },
        },
      })

      if (
        existingDocument &&
        existingDocument.contentHash === contentHash &&
        existingDocument.status === DocumentStatus.READY &&
        existingDocument._count.chunks > 0
      ) {
        await this.prisma.document.update({
          where: { id: existingDocument.id },
          data: {
            title: extractedContent.title,
            markdown,
            status: DocumentStatus.READY,
            indexedAt: new Date(),
            errorMessage: null,
          },
        })

        this.logger.log(`Skipped unchanged document ${url}`)
        return 'skipped'
      }

      const chunks = this.chunkerService.chunk(markdown)
      if (chunks.length === 0) {
        throw new Error('No chunks were generated from markdown content')
      }

      await this.prisma.$transaction(async (transaction) => {
        const updatedDocument = await transaction.document.update({
          where: { id: document.id },
          data: {
            title: extractedContent.title,
            markdown,
            contentHash,
            status: DocumentStatus.PROCESSING,
            errorMessage: null,
          },
        })

        await transaction.chunk.deleteMany({
          where: {
            documentId: updatedDocument.id,
          },
        })

        const createdChunks = await Promise.all(
          chunks.map((chunk) =>
            transaction.chunk.create({
              data: {
                documentId: updatedDocument.id,
                content: chunk.content,
                section: chunk.section,
                tokenCount: chunk.tokenCount,
                chunkIndex: chunk.chunkIndex,
                startOffset: chunk.startOffset,
                endOffset: chunk.endOffset,
                metadata: chunk.metadata as Prisma.InputJsonObject | undefined,
              },
            }),
          ),
        )

        const vectors = await this.embeddingService.generateEmbeddings(
          createdChunks.map((chunk) => chunk.content),
        )
        if (vectors.length !== createdChunks.length) {
          throw new Error('Embedding count did not match chunk count')
        }

        await this.embeddingService.storeEmbeddings(
          transaction,
          createdChunks.map((chunk, index) => ({
            chunkId: chunk.id,
            vector: vectors[index],
          })),
        )

        await transaction.document.update({
          where: { id: updatedDocument.id },
          data: {
            status: DocumentStatus.READY,
            indexedAt: new Date(),
            errorMessage: null,
          },
        })
      })

      this.logger.log(`Indexed ${url}`)
      return 'indexed'
    } catch (error) {
      this.logger.error(`Indexing failed for ${url} at stage=page: ${this.getErrorMessage(error)}`)

      if (documentId) {
        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: DocumentStatus.FAILED,
            errorMessage: this.getErrorMessage(error),
          },
        })
      }

      throw error
    }
  }

  private hashContent(markdown: string): string {
    return createHash('sha256').update(markdown).digest('hex')
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error'
  }
}
