import { Injectable } from '@nestjs/common'

export interface CrawledPage {
  url: string
  html: string
}

@Injectable()
export class CrawlerService {
  private readonly requestTimeoutMs = 10000

  async fetchPage(url: string): Promise<CrawledPage> {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'DocBrainBot/1.0 (+https://docbrain.local)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(this.requestTimeoutMs),
    })

    if (!response.ok) {
      throw new Error(`Fetch failed with ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      throw new Error(`Unsupported content type: ${contentType || 'unknown'}`)
    }

    return {
      url: response.url,
      html: await response.text(),
    }
  }
}
