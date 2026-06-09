import { Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'
import { normalizeDiscoveredUrl } from './url.utils'

@Injectable()
export class LinkDiscoveryService {
  private readonly requestTimeoutMs = 10000

  async discover(rootUrl: string, maxPages: number): Promise<string[]> {
    const response = await fetch(rootUrl, {
      headers: { Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(this.requestTimeoutMs),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch root page: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const discoveredUrls = new Set<string>()
    const normalizedRootUrl = normalizeDiscoveredUrl(rootUrl, rootUrl)

    if (normalizedRootUrl) {
      discoveredUrls.add(normalizedRootUrl)
    }

    $('a[href]').each((_, element) => {
      if (discoveredUrls.size >= maxPages) {
        return false
      }

      const href = $(element).attr('href')
      if (!href) {
        return
      }

      const normalizedUrl = normalizeDiscoveredUrl(href, rootUrl)
      if (normalizedUrl) {
        discoveredUrls.add(normalizedUrl)
      }
    })

    return [...discoveredUrls].slice(0, maxPages)
  }
}
