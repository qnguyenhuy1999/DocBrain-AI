import { Injectable, Logger } from '@nestjs/common'
import * as cheerio from 'cheerio'
import { normalizeDiscoveredUrl } from './url.utils'

@Injectable()
export class SitemapDiscoveryService {
  private readonly logger = new Logger(SitemapDiscoveryService.name)
  private readonly sitemapPaths = ['/sitemap.xml', '/sitemap_index.xml']
  private readonly requestTimeoutMs = 10000

  async discover(rootUrl: string, maxPages: number): Promise<string[]> {
    const discoveredUrls = new Set<string>()
    const visitedSitemaps = new Set<string>()

    for (const sitemapPath of this.sitemapPaths) {
      const sitemapUrl = new URL(sitemapPath, rootUrl).toString()
      const urls = await this.walkSitemap(
        sitemapUrl,
        rootUrl,
        maxPages,
        visitedSitemaps,
        discoveredUrls,
      )

      if (urls.length > 0) {
        return urls
      }
    }

    return []
  }

  private async walkSitemap(
    sitemapUrl: string,
    rootUrl: string,
    maxPages: number,
    visitedSitemaps: Set<string>,
    discoveredUrls: Set<string>,
  ): Promise<string[]> {
    if (visitedSitemaps.has(sitemapUrl) || discoveredUrls.size >= maxPages) {
      return [...discoveredUrls].slice(0, maxPages)
    }

    visitedSitemaps.add(sitemapUrl)

    let response: Response
    try {
      response = await fetch(sitemapUrl, {
        headers: { Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8' },
        signal: AbortSignal.timeout(this.requestTimeoutMs),
      })
    } catch (error) {
      this.logger.debug(`Failed to fetch sitemap ${sitemapUrl}: ${this.getErrorMessage(error)}`)
      return [...discoveredUrls].slice(0, maxPages)
    }

    if (!response.ok) {
      return [...discoveredUrls].slice(0, maxPages)
    }

    const xml = await response.text()
    const $ = cheerio.load(xml, { xmlMode: true })
    const nestedSitemaps = $('sitemap > loc')
      .map((_, element) => $(element).text().trim())
      .get()

    for (const nestedSitemap of nestedSitemaps) {
      if (discoveredUrls.size >= maxPages) {
        break
      }

      await this.walkSitemap(nestedSitemap, rootUrl, maxPages, visitedSitemaps, discoveredUrls)
    }

    const pageUrls = $('url > loc')
      .map((_, element) => $(element).text().trim())
      .get()

    for (const pageUrl of pageUrls) {
      if (discoveredUrls.size >= maxPages) {
        break
      }

      const normalizedUrl = normalizeDiscoveredUrl(pageUrl, rootUrl)
      if (normalizedUrl) {
        discoveredUrls.add(normalizedUrl)
      }
    }

    return [...discoveredUrls].slice(0, maxPages)
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error'
  }
}
