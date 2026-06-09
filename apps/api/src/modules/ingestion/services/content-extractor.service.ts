import { Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'

export interface ExtractedContent {
  title: string
  html: string
}

@Injectable()
export class ContentExtractorService {
  private readonly selectors = [
    'article',
    'main',
    '[role="main"]',
    '.docs-content',
    '.documentation',
    'body',
  ]

  extract(html: string, url: string): ExtractedContent {
    const $ = cheerio.load(html)

    $('script, style, nav, footer, header, aside').remove()

    for (const selector of this.selectors) {
      const element = $(selector).first()
      const extractedHtml = element.html()?.trim()

      if (extractedHtml && element.text().trim().length > 0) {
        return {
          title: this.extractTitle($, url),
          html: extractedHtml,
        }
      }
    }

    throw new Error('Could not extract page content')
  }

  private extractTitle($: cheerio.CheerioAPI, url: string): string {
    const title = $('title').first().text().trim()
    if (title) {
      return title
    }

    const heading = $('h1').first().text().trim()
    if (heading) {
      return heading
    }

    return new URL(url).hostname
  }
}
